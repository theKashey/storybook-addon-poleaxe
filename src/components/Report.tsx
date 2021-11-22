import {useAddonState, useChannel} from "@storybook/api";
import {STORY_RENDERED} from '@storybook/core-events';
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from 'react';
import {buildTree, listHeadings, getCorrespondingHeading} from "yoxel";
import type {SemanticTree} from 'yoxel';

import {ADDON_ID} from "../constants";
import {htmlStyles} from "./report-styles";
import {getHeaderPrefix, getStoryFrame, getStoryTarget} from "./utils";

const pickNodePayload = (tree: SemanticTree): ReactNode => {
  switch (tree.type) {
    case 'section':
    case 'article': {
      const labelled = getCorrespondingHeading(tree);
      switch (labelled?.type) {
        case 'labeled':
          return <span>label: {labelled.payload}</span>;
        case 'labelledby':
          return <span>labeled-by: {labelled.payload}</span>
        case 'contain':
          return <span>with heading: {labelled.payload}</span>;
        case 'error':
        case 'warning':
          return <i>!! {labelled.payload} !!</i>
      }
      return <i>missing heading</i>;
    }
  }

  switch (tree.category) {
    case 'header':
      return <>{getHeaderPrefix(tree)} <b>{tree.type}</b> {tree.payload}</>
  }

  return tree.payload || '';
}

const renderHeaders = (headers: SemanticTree[]): ReactNode => {
  const set = (new Set<string>(headers.map(h => h.type)));
  return (
    <ul className="yoxel-header-list">
      {new Array(6).fill(1).map((_, index) => `h${index + 1}`).map(h => (
        <li>{set.has(h) ? <strong>{h}</strong> : h}</li>
      ))}
    </ul>
  )
}

const isVisible = (node: HTMLElement) => node.getBoundingClientRect().width > 1;

export const buildReport = (tree: SemanticTree, setHoverOn: (el: SemanticTree | null) => void): ReactElement => {
  return (
    <div className={`yoxel-list yoxel-type-${tree.category} yoxel-${tree.type}`} data-type={tree.type}>
      {pickNodePayload(tree)}
      {/*skip link*/}
      {tree.node.id ? <i className="yoxel-skip-link">#${tree.node.id}</i> : ''}
      {isVisible(tree.node) ? null : <i className="yoxel-node-meta">invisible</i>}
      {tree.children.length ?
        <ul>{tree.children.map((block, index) => (
          <li
            key={index}
            onMouseMove={(e) => {
              e.stopPropagation();
              setHoverOn(block);
            }}
          >
            {buildReport(block, setHoverOn)}
          </li>
        ))}</ul> : null}
    </div>
  )
}

const createHL = (doc: Document): HTMLDivElement => {
  const hl = doc.createElement('div')
  hl.id = 'poleaxe-highlight';
  doc.body.appendChild(hl);
  return hl;
}

export const ReportPanel: React.FC = () => {
  const [report, setReport] = useState<SemanticTree | undefined>(undefined);
  const [update, setUpdate] = useState({});
  const [hoveredOn, setHoverOn] = useState<SemanticTree | null>(null);

  useChannel({
    [STORY_RENDERED]: () => setUpdate({}),
  });

  useEffect(() => {
    setHoverOn(null);
    const storyFrame = getStoryTarget();
    if (storyFrame) {
      const updateReport = () => {
        setReport(buildTree(storyFrame));
      }
      updateReport();

      const observer = new MutationObserver(() => updateReport());
      observer.observe(storyFrame, {subtree: true, childList: true});
      return () => observer.disconnect();
    }
    return () => null;
  }, [update]);

  useEffect(() => {
    const docs = getStoryFrame()!;
    const hl: HTMLDivElement = docs.querySelector('#poleaxe-highlight') || createHL(docs);
    if (hoveredOn) {
      const box = hoveredOn.node.getBoundingClientRect();
      Object.assign(hl.style, {
        left: box.left + 'px',
        top: box.top + 'px',
        width: box.width + 'px',
        height: box.height + 'px',
        position: 'fixed',
        border: '1px solid red',
        backgroundColor: 'rgba(200,200,255,0.2)',
        pointerEvents: 'none',
        display: 'block'
      });
      hoveredOn.node.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    } else {
      hl.style.display = 'none';
    }
  }, [hoveredOn]);

  const headers = useMemo(() => (
    report ? listHeadings(report) : []
  ), [report]);

  const [nestedMode, setNestedMode] = useAddonState(ADDON_ID + '/nested', true)

  return (<div
      onMouseLeave={() => setHoverOn(null)}
      className={['yoxel-addon-panel', nestedMode ? 'yoxel-mode-nested' : ''].join(' ')}
    >
      <style dangerouslySetInnerHTML={{__html: htmlStyles}}/>
      <div>
        <label>
          display as tree
          <input type={"checkbox"} defaultChecked onChange={(e) => setNestedMode(e.currentTarget.checked)}/>
        </label>
      </div>

      {renderHeaders(headers)}
      {report ? (
        <>
          {buildReport(report, setHoverOn)}
        </>
      ) : null}
    </div>
  )
}
import {useChannel} from "@storybook/api";
import {STORY_RENDERED} from '@storybook/core-events';
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from 'react';

import {buildTree, findNearestHeader, listHeaders, SemanticTree} from "yoxel";

import {htmlStyles} from "./report-styles";
import {getStoryFrame, getStoryTarget} from "./utils";

const getHeaderPrefix = (tree: SemanticTree): string => {
  const pad = (n: number) => `${'-'.repeat(n)} `;

  switch (tree.type) {
    case 'h1':
      return pad(0);
    case 'h2':
      return pad(1);
    case 'h3':
      return pad(2);
    case 'h4':
      return pad(3);
    case 'h5':
      return pad(4);
    case 'h6':
      return pad(5);
  }
  return '';
}


const pickNodePayload = (tree: SemanticTree): ReactNode => {
  switch (tree.type) {
    case 'section':
    case 'article': {
      const header = findNearestHeader(tree.children);
      if (header) {
        return `@ <- ${header.payload}`
      } else {
        return <i>missing header</i>
      }
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

export const buildReport = (tree: SemanticTree, setHoverOn: (el: SemanticTree | null) => void): ReactElement => {
  return (
    <div className={`yoxel-list yoxel-type-${tree.category} yoxel-${tree.type}`} data-type={tree.type}>
      {pickNodePayload(tree)}
      {/*skip link*/}
      {tree.node.id ? `#${tree.node.id}` : ''}
      {tree.children.length ?
        <ul>{tree.children.map((block, index) => (
          <li
            key={index}
            onMouseEnter={() => setHoverOn(block)}
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
        display: 'block'
      });
    } else {
      hl.style.display = 'none';
    }
  }, [hoveredOn]);

  const headers = useMemo(() => (
    report ? listHeaders(report) : []
  ), [report]);

  return (<div onMouseLeave={() => setHoverOn(null)}>
      <style dangerouslySetInnerHTML={{__html: htmlStyles}}/>
      {report ? (
        <>
          {renderHeaders(headers)}
          {buildReport(report, setHoverOn)}
        </>
      ) : null}
    </div>
  )
}
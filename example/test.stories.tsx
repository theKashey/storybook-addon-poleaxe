import React from 'react';

console.log('file matched');

export const PageSkeleton = () => (
  <div>
    <header>
      <nav>navigation</nav>
    </header>
    <main id="main">
      <h1>heading 1</h1>
      <h2>heading 2</h2>
    </main>
  </div>
)

export const PageTree = () => (
  <div>
    <h1>heading 1</h1>
    <h2>heading 2</h2>
    <h1>heading 1</h1>
    <h2>heading 2</h2>
    <h2>heading 2</h2>
    <h3>heading 3</h3>
    <h1>heading 1</h1>
  </div>
)

export const PageSections = () => (
  <div>
    <section>
      <h1>heading 1</h1>
      <h2>heading 2</h2>
    </section>
    <section>
      <header>
        <h1>heading 1</h1>
        <h2>heading 2</h2>
      </header>
      <h2>heading 2 for section</h2>
      <h3>heading 3</h3>
    </section>
    <h1>heading 1</h1>
  </div>
)

export const SectionsLabels = () => (
  <div>
    <style dangerouslySetInnerHTML={{__html:`
      .sr-only:not(:focus):not(:active) {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    `}}/>
    <h1>section test</h1>
    <section>
      <h2>section auto-heading</h2>
      section with heading inside
    </section>
    <section aria-labelledby={'hs2'}>
      <h2 id={'hs2'}>labeled section header</h2>
      section with explicit heading
    </section>
    <section aria-label={'aria section caption'}>
      <h2>section header</h2>
      section with explicit label
    </section>
    <br/>
    another section down
    <section>
      <h2 className="sr-only">section header</h2>
      section with explicit label
    </section>

    <article>
      <h2>article autoheading</h2>
      article with heading inside
    </article>
    <article aria-labelledby={'ha2'}>
      <h2 id={'ha2'}>labeled article header</h2>
      article with explicit heading
    </article>

  </div>
)

export default {
  title: 'yoxel integration'
}
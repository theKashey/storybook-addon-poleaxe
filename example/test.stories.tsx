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

export default {
  title: 'yoxel integration'
}
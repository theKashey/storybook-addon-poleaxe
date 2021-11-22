export const htmlStyles = `
.yoxel-addon-panel {
  padding: 15px;
}

.yoxel-type-area {
  padding: 0;  
  position: relative;
  padding-top: 6px;
}

.yoxel-mode-nested .yoxel-type-area {
  border-left: 1px solid #444;
  padding: 2px;
}

.yoxel-list:hover {
  background-color: rgba(200,200, 255, 0.3);
}

.yoxel-type-area ul {
  padding-left: 0;
  list-style: none;
}

.yoxel-mode-nested .yoxel-type-area ul {
  padding-left: 16px;  
}

.yoxel-type-area:before {
 content: attr(data-type);
 background-color: #EFE;
 padding: 2px;
 margin-left:-2px;
}

.yoxel-header-list {
 display: flex;
 list-style: none;
 gap: 4px;
 padding: 0;
}

.yoxel-skip-link {
 color: #666;
 margin-left: 16px;
}

.yoxel-node-meta {
 background-color: rgba(255,200,200,0.3); 
 color: #444;
 padding: 4px;
}
`

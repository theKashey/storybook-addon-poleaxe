export const htmlStyles = `
.yoxel-type-area {
  border-left: 1px solid #444;
  padding: 2px;  
  position: relative;
  padding-top: 6px;
}

.yoxel-list:hover {
  background-color: rgba(200,200, 255, 0.3);
}

.yoxel-type-area ul {
  padding-left: 16px;
  list-style: none;
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
`

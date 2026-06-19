import { toFileTree } from "./business";
import { FileTreeNode, FolderMeta, TreeNodeType } from "./model";

test("toFileTree, base case", async () => {
  const folderMeta: FolderMeta = {
    items: []
  };

  const expectedTree: FileTreeNode = {
    type: TreeNodeType.Folder,
    nodes: [],
    fullPath: [],
    name: ""
  };

  const tree = toFileTree(folderMeta);

  expect(tree).toStrictEqual(expectedTree);
});

test("toFileTree, one file, direct", async () => {
  const folderMeta: FolderMeta = {
    items: [
      {
        path: "aaa.txt",
        hash: "hash",
        size: 123
      }
    ]
  };

  const expectedTree: FileTreeNode = {
    type: TreeNodeType.Folder,
    nodes: [
      {
        type: TreeNodeType.File,
        fullPath: [],
        name: "aaa.txt",
        objectKey: "hash",
        size: 123
      }
    ],
    fullPath: [],
    name: ""
  };

  const tree = toFileTree(folderMeta);

  expect(tree).toStrictEqual(expectedTree);
});

test("toFileTree, one file, in a folder", async () => {
  const folderMeta: FolderMeta = {
    items: [
      {
        path: "fff/aaa.txt",
        hash: "hash",
        size: 123
      }
    ]
  };

  const expectedTree: FileTreeNode = {
    type: TreeNodeType.Folder,
    nodes: [
      {
        type: TreeNodeType.Folder,
        fullPath: ["fff"],
        name: "fff",
        nodes: [
          {
            type: TreeNodeType.File,
            fullPath: ["fff"],
            name: "aaa.txt",
            objectKey: "hash",
            size: 123
          }
        ]
      }
    ],
    fullPath: [],
    name: ""
  };

  const tree = toFileTree(folderMeta);

  expect(tree).toStrictEqual(expectedTree);
});

test("toFileTree, one file, 2 folders deep", async () => {
  const folderMeta: FolderMeta = {
    items: [
      {
        path: "fff/ggg/aaa.txt",
        hash: "hash",
        size: 123
      }
    ]
  };

  const expectedTree: FileTreeNode = {
    type: TreeNodeType.Folder,
    nodes: [
      {
        type: TreeNodeType.Folder,
        fullPath: ["fff"],
        name: "fff",
        nodes: [
          {
            type: TreeNodeType.Folder,
            fullPath: ["fff", "ggg"],
            name: "ggg",
            nodes: [
              {
                type: TreeNodeType.File,
                fullPath: ["fff", "ggg"],
                name: "aaa.txt",
                objectKey: "hash",
                size: 123
              }
            ]
          }
        ]
      }
    ],
    fullPath: [],
    name: ""
  };

  const tree = toFileTree(folderMeta);

  expect(tree).toStrictEqual(expectedTree);
});

test("toFileTree, 2 files, same folder", async () => {
  const folderMeta: FolderMeta = {
    items: [
      {
        path: "fff/ggg/aaa.txt",
        hash: "hash",
        size: 123
      },
      {
        path: "fff/ggg/bbb.txt",
        hash: "hash2",
        size: 1234
      }
    ]
  };

  const expectedTree: FileTreeNode = {
    type: TreeNodeType.Folder,
    nodes: [
      {
        type: TreeNodeType.Folder,
        fullPath: ["fff"],
        name: "fff",
        nodes: [
          {
            type: TreeNodeType.Folder,
            fullPath: ["fff", "ggg"],
            name: "ggg",
            nodes: [
              {
                type: TreeNodeType.File,
                fullPath: ["fff", "ggg"],
                name: "aaa.txt",
                objectKey: "hash",
                size: 123
              },
              {
                type: TreeNodeType.File,
                fullPath: ["fff", "ggg"],
                name: "bbb.txt",
                objectKey: "hash2",
                size: 1234
              }
            ]
          }
        ]
      }
    ],
    fullPath: [],
    name: ""
  };

  const tree = toFileTree(folderMeta);

  expect(tree).toStrictEqual(expectedTree);
});

test("toFileTree, 2 files, fiesta", async () => {
  const folderMeta: FolderMeta = {
    items: [
      {
        path: "fff/ggg/aaa.txt",
        hash: "hash",
        size: 123
      },
      {
        path: "fff/ggg/bbb.txt",
        hash: "hash2",
        size: 1234
      },
      {
        path: "fff/ccc.txt",
        hash: "hash3",
        size: 12345
      },
      {
        path: "fff/ggg/hhh/ddd.txt",
        hash: "hash5",
        size: 123456
      }
    ]
  };

  const expectedTree: FileTreeNode = {
    type: TreeNodeType.Folder,
    nodes: [
      {
        type: TreeNodeType.Folder,
        fullPath: ["fff"],
        name: "fff",
        nodes: [
          {
            type: TreeNodeType.Folder,
            fullPath: ["fff", "ggg"],
            name: "ggg",
            nodes: [
              {
                type: TreeNodeType.File,
                fullPath: ["fff", "ggg"],
                name: "aaa.txt",
                objectKey: "hash",
                size: 123
              },
              {
                type: TreeNodeType.File,
                fullPath: ["fff", "ggg"],
                name: "bbb.txt",
                objectKey: "hash2",
                size: 1234
              },
              {
                type: TreeNodeType.Folder,
                fullPath: ["fff", "ggg", "hhh"],
                name: "hhh",
                nodes: [
                  {
                    type: TreeNodeType.File,
                    fullPath: ["fff", "ggg", "hhh"],
                    name: "ddd.txt",
                    objectKey: "hash5",
                    size: 123456
                  }
                ]
              }
            ]
          },
          {
            type: TreeNodeType.File,
            fullPath: ["fff"],
            name: "ccc.txt",
            objectKey: "hash3",
            size: 12345
          }
        ]
      }
    ],
    fullPath: [],
    name: ""
  };

  const tree = toFileTree(folderMeta);

  expect(tree).toStrictEqual(expectedTree);
});
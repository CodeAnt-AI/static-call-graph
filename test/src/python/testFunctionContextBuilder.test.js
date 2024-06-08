const { functionContextBuilderPython } = require('../../../src/python/functionContextBuilder');

describe('functionContextBuilderPython', () => {
    it('Function with no parent and no children', () => {
        expect(functionContextBuilderPython('/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory', '/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/testCodeDirectoryNested2/c.py', "func4")).toEqual({
            "parents":[],
            "children":[]
        });
    });
});

describe('functionContextBuilderPython', () => {
    it('Function with parents and no children', () => {
        expect(functionContextBuilderPython('/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory', '/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/testCodeDirectoryNested2/c.py', "func3")).toEqual({
            "parents":[{
                "fileName":"/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/a.py",
                "functionName":"func1",
            },
            {
                "fileName":"/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/b.py",
                "functionName":"func2",
            }],
            "children":[]
        });
    });
});

describe('functionContextBuilderPython', () => {
    it('Function with no parents and children', () => {
        expect(functionContextBuilderPython('/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory', '/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/a.py', "func1")).toEqual({
            "parents":[],
            "children":[
                {
                    "fileName":"/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/b.py",
                    "functionName":"func2",
                },{
                "fileName":"/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/testCodeDirectoryNested2/c.py",
                "functionName":"func3",
            }]
        });
    });
});

describe('functionContextBuilderPython', () => {
    it('Function with parents and children', () => {
        expect(functionContextBuilderPython('/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory', '/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/b.py', "func2")).toEqual({
            "parents":[
                {
                    "fileName":"/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/a.py",
                    "functionName":"func1",
                }],
            "children":[{
                "fileName":"/home/ubuntu/static-call-graph/test/src/python/testCodeDirectory/testCodeDirectoryNested/testCodeDirectoryNested2/c.py",
                "functionName":"func3",
            }]
        });
    });
});
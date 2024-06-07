
const { findPythonFunctionDefinitions } = require('../../../src/python/functionDefinitionDetector');

describe('findPythonFunctionDefinitions', () => {
    it('should return an empty list for an empty string', async () => {
        expect(await findPythonFunctionDefinitions('', 'test.py')).toEqual([]);
    });
});

describe('findPythonFunctionDefinitions', () => {
    it('should correctly identify a single straightforward function definition in the code', async () => {
        const code = `
def hello_world():
    print("Hello, world!")
        `;
        const fileName = 'test.py';
        const result = await findPythonFunctionDefinitions(code, fileName);
        expect(result).toEqual([
            {
                type: 'Function',
                fileName: 'test.py',
                name: 'hello_world',
                startLine: 2,
                endLine: 3,
                startColumn: 0,
                endColumn: 26,
                startCharPosition: 1,
                endCharPosition: 46
            }
        ]);
    });
});

describe('findPythonFunctionDefinitions', () => {
    it('should return all function definitions in the code',async () => {
        const code = `
def foo():
    pass

def bar():
    pass
        `;
        const fileName = 'test.py';
        const expectedOutput = [
            {
                type: 'Function',
                fileName: 'test.py',
                name: 'foo',
                startLine: 2,
                endLine: 3,
                startColumn: 0,
                endColumn: 8,
                startCharPosition: 1,
                endCharPosition: 20,
            },
            {
                type: 'Function',
                fileName: 'test.py',
                name: 'bar',
                startLine: 5,
                endLine: 6,
                startColumn: 0,
                endColumn: 8,
                startCharPosition: 22,
                endCharPosition: 41,
            }
        ];
  
        expect(await findPythonFunctionDefinitions(code, fileName)).toEqual(expectedOutput);
    });
});

describe('findPythonFunctionDefinitions', () => {
    it('should detect a function with a decorator', async () => {
        const code = `
@decorator
def my_function():
    pass
        `;
        const fileName = 'sample.py';
        const expected = [{
            type: 'Function',
            fileName: 'sample.py',
            name: 'my_function',
            startLine: 3,
            endLine: 4,
            startColumn: 0,
            endColumn: 8,
            startCharPosition: 12,
            endCharPosition: 39
        }];
        expect(await findPythonFunctionDefinitions(code, fileName)).toEqual(expected);
    });
});

describe('findPythonFunctionDefinitions', () => {
    it('should identify functions with varying parameters in the provided code', async () => {
        const code = `
def foo():
    pass

def bar(x):
    pass

def baz(x, y):
    pass
        `;
        const fileName = 'sample.py';
        const result = await findPythonFunctionDefinitions(code, fileName);
        expect(result).toEqual([
            {
                type: 'Function',
                fileName: 'sample.py',
                name: 'foo',
                startLine: 2,
                endLine: 3,
                startColumn: 0,
                endColumn: 8,
                startCharPosition: 1,
                endCharPosition: 20
            },
            {
                type: 'Function',
                fileName: 'sample.py',
                name: 'bar',
                startLine: 5,
                endLine: 6,
                startColumn: 0,
                endColumn: 8,
                startCharPosition: 22,
                endCharPosition: 42
            },
            {
                type: 'Function',
                fileName: 'sample.py',
                name: 'baz',
                startLine: 8,
                endLine: 9,
                startColumn: 0,
                endColumn: 8,
                startCharPosition: 44,
                endCharPosition: 67
            }
        ]);
    });
});

describe('findPythonFunctionDefinitions', () => {
    it('should return an empty array when there are no function definitions in the code', async () => {
        const code = `
print("Hello World")
x = 10
        `;

        expect(await findPythonFunctionDefinitions(code, 'test.py')).toEqual([]);
    });
});

describe('findPythonFunctionDefinitions', () => {
    it('should return an empty array for code with syntax errors', async () => {
        const codeWithErrors = "def foo(  print('Hello'";
        expect(await findPythonFunctionDefinitions(codeWithErrors, 'test.py')).toEqual([]);
    });
});
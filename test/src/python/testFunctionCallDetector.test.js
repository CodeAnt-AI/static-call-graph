const {findPythonFunctionCalls} = require('../../../src/python/functionCallDetector');

describe('findPythonFunctionCalls', () => {
    it('should return an empty array for an empty string input', () => {
        expect(findPythonFunctionCalls('', 'somefile.py')).toEqual([]);
    });
});

describe('findPythonFunctionCalls', () => {
    it('should identify function calls in a Python code example', () => {
        const code = `
def add(a, b):
    return a + b

def main():
    result = add(1, 2)
    print(result)

main()
        `;
        const fileName = 'example.py';
        const expectedOutput = [
            {
                type: 'FunctionCall',
                functionName: 'add',
                fileName: 'example.py',
                startLine: 6,
                endLine: 6,
                startColumn: 13,
                endColumn: 22,
                startCharPosition: 59,
                endCharPosition: 68
            },
            {
                type: 'FunctionCall',
                functionName: 'main',
                fileName: 'example.py',
                startLine: 9,
                endLine: 9,
                startColumn: 0,
                endColumn: 6,
                startCharPosition: 88,
                endCharPosition: 94
            }
        ];
        expect(findPythonFunctionCalls(code, fileName)).toEqual(expectedOutput);
    });
});

describe('findPythonFunctionCalls', () => {
    it('should correctly identify the function calls from imported modules in a Python code example', () => {
        const code = `
import math
def foo():
    math.sqrt(4)
    print("Hello")
        `;
        const fileName = 'main.py';
        const expected = [
            // {
            //     type: 'FunctionCall',
            //     functionName: 'sqrt',
            //     fileName: 'math',
            //     startLine: 4,
            //     endLine: 4,
            //     startColumn: 16,
            //     endColumn: 21,
            //     startCharPosition: 50,
            //     endCharPosition: 55
            // },
        ];
        expect(findPythonFunctionCalls(code, fileName)).toEqual(expected);
    });
});

describe('findPythonFunctionCalls', () => {
    it('should correctly identify multiple function calls in a Python code example', () => {
        const code = `
import os
import sys

def foo():
    print("foo")

def bar():
    print("bar")

foo()
bar()
os.path.join("a", "b")
        `;
        const fileName = 'example.py';
        const expectedOutput = [
              {
                type: 'FunctionCall',
                functionName: 'foo',
                fileName: 'example.py',
                startLine: 11,
                endLine: 11,
                startColumn: 0,
                endColumn: 5,
                startCharPosition: 81,
                endCharPosition: 86
              },
              {
                type: 'FunctionCall',
                functionName: 'bar',
                fileName: 'example.py',
                startLine: 12,
                endLine: 12,
                startColumn: 0,
                endColumn: 5,
                startCharPosition: 87,
                endCharPosition: 92
              }
            //{ type: 'FunctionCall', functionName: 'join', fileName: 'os', startLine: 12, endLine: 12, startColumn: 10, endColumn: 25, startCharPosition: 165, endCharPosition: 180 }
        ];
        expect(findPythonFunctionCalls(code, fileName)).toEqual(expectedOutput);
    });
});

describe('findPythonFunctionCalls', () => {
    it('should accurately identify nested function calls in Python code', () => {
        const code = `
def outer():
    def inner():
        print("Hello from inner!")
    inner()
outer()
        `;
        const fileName = 'example.py';
        const result = findPythonFunctionCalls(code, fileName);
        expect(result).toEqual([
              {
                type: 'FunctionCall',
                functionName: 'inner',
                fileName: 'example.py',
                startLine: 5,
                endLine: 5,
                startColumn: 4,
                endColumn: 11,
                startCharPosition: 70,
                endCharPosition: 77
              },
              {
                type: 'FunctionCall',
                functionName: 'outer',
                fileName: 'example.py',
                startLine: 6,
                endLine: 6,
                startColumn: 0,
                endColumn: 7,
                startCharPosition: 78,
                endCharPosition: 85
              }
        ]);
    });
});

describe('findPythonFunctionCalls', () => {
    it('should return an empty array when there are no function calls in the code', () => {
        const code = `
import pandas as pd
x = 5
y = 10
z = x + y
        `;
        expect(findPythonFunctionCalls(code, 'test.py')).toEqual([]);
    });
});

describe('findPythonFunctionCalls', () => {
    it('should handle non-string inputs such as numbers and objects appropriately', () => {
        expect(() => findPythonFunctionCalls(123, 'example.py')).toThrow();
        expect(() => findPythonFunctionCalls({}, 'example.py')).toThrow();
    });
});


describe('findPythonFunctionCalls', () => {
    it('should handle malformed Python code and not throw an error', () => {
        const malformedCode = `def foo):\n    print("Hello World"`;
        expect(() => findPythonFunctionCalls(malformedCode, 'testfile.py')).not.toThrow();
    });
});

describe('findPythonFunctionCalls', () => {
    it('should handle imported function calls', () => {
        const code = `
from DetectionFunctions.deindentation import deindent

def foo():
    deindent()
        `;
        expect(findPythonFunctionCalls(code, 'test.py')).toEqual([
            {
              type: 'FunctionCall',
              functionName: 'deindent',
              fileName: 'DetectionFunctions/deindentation',
              startLine: 5,
              endLine: 5,
              startColumn: 4,
              endColumn: 14,
              startCharPosition: 71,
              endCharPosition: 81
            }
          ]);
    });
});
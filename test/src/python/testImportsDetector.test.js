const {findPythonImports} = require('../../../src/python/importsDetector');

describe('findPythonImports', () => {
    it('should return an empty object for an empty string input', async () => {
        expect(await findPythonImports('')).toEqual({});
    });
});

describe('findPythonImports', () => {
    it("should correctly return the module path for 'import os' statement", async () => {
        const code = "import os";
        expect(await findPythonImports(code)).toEqual({ os: 'os' });
    });
});

describe('findPythonImports', () => {
    it('should correctly detect and return all modules for multiple import statements', async () => {
        const code = 'import os\nimport sys';
        expect(await findPythonImports(code)).toEqual({ 'os': 'os', 'sys': 'sys' });
    });
});

describe('findPythonImports', () => {
    it("should handle 'import numpy as np' and return the correct alias in the output", async () => {
        const code = "import numpy as np";
        expect(await findPythonImports(code)).toEqual({ np: 'numpy' });
    });
});

describe('findPythonImports', () => {
    it('should correctly identify nested imports within a function', async () => {
        const code = `
            def example_function():
                import os
                import sys as system
                if True:
                    import json
            `;
        const expectedImports = {
            'os': 'os',
            'system': 'sys',
            'json': 'json'
        };
        expect(await findPythonImports(code)).toEqual(expectedImports);
    });
});

describe('findPythonImports', () => {
    it('should return an empty object for Python code with no import statements', async () => {
        const code = `
        def add(a, b):
            return a + b

        x = add(2, 3)
        print(x)
        `;
        expect(await findPythonImports(code)).toEqual({});
    });
});

describe('findPythonImports', () => {
    it('should handle complex import statements with dotted names', async () => {
        const code = "from module.submodule import ClassName";
        const expectedOutput = { 'ClassName': 'module/submodule' };
        expect(await findPythonImports(code)).toEqual(expectedOutput);
    });
});

describe('findPythonImports', () => {
    it('should handle complex import statements with dotted names and aliases correctly', async () => {
        const code = "from module.submodule import ClassName as Alias";
        const expectedOutput = { 'Alias': 'module/submodule' };
        expect(await findPythonImports(code)).toEqual(expectedOutput);
    });
});

describe('findPythonImports', () => {
    it('should handle syntax errors in the Python code without throwing exceptions', () => {
        const codeWithSyntaxError = `import os\nimport sys\nfrom bad import\nsomething()`;
        expect(async () => await findPythonImports(codeWithSyntaxError)).not.toThrow();
    });
});

describe('findPythonImports', () => {
    it('should handle import statements with dotted names 2', async () => {
        const code = "from DetectionFunctions.deindentation import deindent";
        const expectedOutput = { 'deindent': 'DetectionFunctions/deindentation' };
        expect(await findPythonImports(code)).toEqual(expectedOutput);
    });
});
import type { CodeBlock } from "notion-types";
import type { Lang } from "shiki";

// prettier-ignore
const shikiLangs = ['abap', 'actionscript-3', 'ada', 'apache', 'apex', 'apl', 'applescript', 'asm', 'astro', 'awk', 'ballerina', 'bat', 'batch', 'berry', 'be', 'bibtex', 'bicep', 'c', 'clojure', 'clj', 'cobol', 'codeql', 'ql', 'coffee', 'cpp', 'crystal', 'csharp', 'c#', 'css', 'cue', 'd', 'dart', 'diff', 'docker', 'dream-maker', 'elixir', 'elm', 'erb', 'erlang', 'fish', 'fsharp', 'f#', 'gherkin', 'git-commit', 'git-rebase', 'gnuplot', 'go', 'graphql', 'groovy', 'hack', 'haml', 'handlebars', 'hbs', 'haskell', 'hcl', 'hlsl', 'html', 'ini', 'java', 'javascript', 'js', 'jinja-html', 'json', 'jsonc', 'jsonnet', 'jssm', 'fsl', 'jsx', 'julia', 'jupyter', 'kotlin', 'latex', 'less', 'lisp', 'logo', 'lua', 'make', 'makefile', 'markdown', 'md', 'marko', 'matlab', 'mdx', 'nginx', 'nim', 'nix', 'objective-c', 'objc', 'objective-cpp', 'ocaml', 'pascal', 'perl', 'php', 'plsql', 'postcss', 'powershell', 'ps', 'ps1', 'prisma', 'prolog', 'pug', 'jade', 'puppet', 'purescript', 'python', 'py', 'r', 'raku', 'perl6', 'razor', 'rel', 'riscv', 'ruby', 'rb', 'rust', 'rs', 'sas', 'sass', 'scala', 'scheme', 'scss', 'shaderlab', 'shader', 'shellscript', 'shell', 'bash', 'sh', 'zsh', 'smalltalk', 'solidity', 'sparql', 'sql', 'ssh-config', 'stata', 'stylus', 'styl', 'svelte', 'swift', 'system-verilog', 'tasl', 'tcl', 'tex', 'toml', 'tsx', 'turtle', 'twig', 'typescript', 'ts', 'vb', 'cmd', 'verilog', 'vhdl', 'viml', 'vim', 'vimscript', 'vue-html', 'vue', 'wasm', 'wenyan', '文言', 'xml', 'xsl', 'yaml', 'zenscript'];

export const getCodeLangText = (langData: CodeBlock["properties"]["language"]) => {
	return langData[0][0];
};

export const convertCodeLangNotionToShiki = (langText: string) => {
	return shikiLangs.includes(langText?.toLowerCase())
		? (langText.toLowerCase() as Lang)
		: undefined;
};

export const getNotionCodeProps = (langData: CodeBlock["properties"]["language"]) => {
	const text = getCodeLangText(langData);
	const shikiLang = convertCodeLangNotionToShiki(text);
	return { text, shikiLang };
};

import HTML5NamedCharRefs from './simple-html-tokenizer/html5-named-char-refs';
import EntityParser from './simple-html-tokenizer/entity-parser';
import EventedTokenizer from './simple-html-tokenizer/evented-tokenizer';
import Tokenizer from './simple-html-tokenizer/tokenizer';
import tokenize from './simple-html-tokenizer/tokenize';

var HTML5Tokenizer = {
	HTML5NamedCharRefs,
	EntityParser,
	EventedTokenizer,
	Tokenizer,
	tokenize,
};

export default HTML5Tokenizer;

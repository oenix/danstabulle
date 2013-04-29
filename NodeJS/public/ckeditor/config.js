/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	
	// %REMOVE_START%
	// The configuration options below are needed when running CKEditor from source files.
	config.plugins = 'dialogui,dialog,about,basicstyles,clipboard,button,toolbar,list,indent,enterkey,entities,wysiwygarea,fakeobjects,link,pastetext,undo,xml,ajax,panel,floatpanel,listblock,richcombo,format,justify,onchange';
	//config.plugins = 'dialogui,dialog,about,basicstyles,clipboard,button,toolbar,list,indent,enterkey,entities,floatingspace,wysiwygarea,fakeobjects,link,pastetext,undo,xml,ajax,panel,floatpanel,listblock,richcombo,format,justify,onchange';
	config.extraPlugins='onchange'; 	
	config.extraPlugins='save'; 
	
	config.skin = 'kama';
	// %REMOVE_END%

	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for a single toolbar row.
	config.toolbarGroups = [
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		// On the basic preset, clipboard and undo is handled by keyboard.
		// Uncomment the following line to enable them on the toolbar as well.
		// { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'forms' },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];
	
	config.toolbar_Basic =
	[
		['Bold', 'Italic', 'Underline','Strike', 
		'Styles','Format','Font','FontSize',
		'NumberedList', 'BulletedList', '-',
		'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-',
		'Link', 'Unlink','-',
		'Save','NewPage','About']
	];
	
	config.toolbar = 'Basic';
	
	// The default plugins included in the basic setup define some buttons that
	// we don't want too have in a basic editor. We remove them here.
	config.removeButtons = 'Anchor,Underline,Strike,Subscript,Superscript';

	// Considering that the basic setup doesn't provide pasting cleanup features,
	// it's recommended to force everything to be plain text.
	config.forcePasteAsPlainText = true;

	// Let's have it basic on dialogs as well.
	config.removeDialogTabs = 'link:advanced';
};

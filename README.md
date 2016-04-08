# CB-Flex-Extension
This is an easy to use Cross Browser support for the Flex CSS3 attribute - Share your thoughts


This lib was made in order to make our lives easier using the flex box orientations in css using the browser js render engine. 
One of the flex attribute greatest faults is Cross browser use since 2009.
We know that the day that we wont need this kind of aid lib is at hand because browser companies have started to be aligned on their products.
This project was for the fun of use and was not meant to be a thing of the future.   


This lib: 

- Using custom attributs for html tags.
- Will set flex attributes on user demand using browser js render engine and parse relevant attribute to the browser's css render engine.
- Fits for all browsers since 2009 except IE. IE supports version 10 and above.
- Will NOT interfere with the rest of css attributes setted in css file.
- Is case sensitive.
- Is fully automatic for new versions of all browsers and for best results needs to get tweaking values (fine tuning) inside the 'data-display' tag in order to work on old browsers and especially Safari. 
  If these values will not be placed, default values will be used automaticlly instead and not assuring the exact result on old browsers.


=======================================/ List of Contacts

1. Importants
2. Options
3. Recommended use
4. Remarks
5. Browser support


=======================================

1.-----------Importants----------------
 
a) To apply attributes use html tag attr as --> ' data-display="flex" '
b) To init flex call attr set in html tag as follows --> '<tag data-display="flex">content</tag>'  
c) Each data attribute will init css attribute, use as follows --> '<tag data-display="flex" data-align-items="center">content</tag>'
d) Some options were included in order to set values in which old browsers must have like 'wrap width', 'parent flex' and 'child flex' (rest are the same)
e) In order to use with multiple attributes use as follows --> '<tag data-display="flex" data-align-items="center" data-justify-content="center" data-wrap="wrap">content</tag>'
f) For default use for each attribute just us 'default' or blank as -->  '<tag data-display="flex" data-align-items="default">content</tag>'


=======================================

2.-----------Options----------------



	2.1. flex-direction --> ('data-flex-direction')
		2.1.1. row
		2.1.2. row-reverse
		2.1.3. column
		2.1.4. column-reverse
		2.1.5. default = row

	2.2. align-items --> ('data-align-items')
		2.2.1. start
		2.2.2. center
		2.2.3. end
		2.2.4. default = center

	2.3. justify-content --> ('data-justify-content')
		2.3.1. start
		2.3.2. center
		2.3.3. end
		2.3.4. space-around
		2.3.5. space-between
		2.3.6. default = space-around

	2.4. wrap --> ('data-wrap')
		2.4.1. wrap
		2.4.2. nowrap
		2.4.3. default = wrap

	2.5. flex --> parent or children ('data-flex-parent / data-flex-child')
		2.5.1. parent: //--> will apply the attribute on this container
 			2.5.1.1. set as --> ' data-flex-parent="0 1 YYYpx" '
		2.5.2. child: //--> will apply the attribute on this parent's children
			2.5.2.1 for appending attr for all children set as --> ' data-flex-child="0 1 YYYpx" '
			2.5.2.2 can also be set as --> ' data-flex-child="0 1 YYYpx_0 0 ZZZpx" ' //--- for each child
		2.5.3. in both default are '0 0 auto'

	2.6. order --> ('data-order') //--->setted automaticly for each child as a must! if you want to change order of children just change position of html tag (for alpha version only)
	

	2.7. wrap-width --> ('data-wrap-width') /* will apply only on old syntax (box attribute) */
		2.7.1. can set custom width of screen to wrap children as --> data-wrap-width="YYYYpx"
		2.7.2. default is set to 700px (standard)



=======================================

3.-----------Recommended use----------------

	3.1. Use the commands noted above only, the rest is in your hands and on your responsibility!
	3.2. For standard use there is no need to add 'data-order', 'data-wrap', 'data-wrap-width' (the default attr works like a charm).
	3.3. As you go to previous browser versions while keeping cross-browser concept, the more tweeking you will need to perform with the data attributes and even with the code engine itself.

=======================================

4.-----------Remarks----------------

	4.1. As noted before - this project was for fun only!		


=======================================

5.-----------Browser support----------------


	5.1. Chrome: 29+
	5.2. Firefox: 20+
	5.3. Safari: 5+
	5.4. Opera: 17+
	5.5. IE: 9+

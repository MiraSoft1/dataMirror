function getError() {}
window.onerror = function(message, source, lineno, colno, error) {
	const err = document.createElement("pre");
	err.className = "dm-error mirror";
	err.appendChild(p(`Error : ${error}`))
	err.appendChild(p(`Source: ${source}`))
	err.appendChild(p(`Line: ${lineno}  Column: ${colno}`))
	document.body.appendChild(err)
}
function isHTML(obj) {
	return obj instanceof Node;
}
function render(parent, child) {
	if (isHTML(parent) && isHTML(child)) {
		parent.appendChild(child);
		return parent;
	}
	return Error("this is'not HTMLElement")
}
function renderAll(parent, ...children) {
	if (!isHTML(parent))
		return;
	children.forEach((child) => {
		if (isHTML(child))
			parent.appendChild(child)
	})
	return parent;
}
function span(text, className = "", id = "") {
	const span = document.createElement("span");
	span.textContent = text;
	if (className)
		span.className = className;
	if (id)
		span.id = id;
	return span;
}

function p(txt, c) {
	const p = document.createElement("p");
	p.innerHTML = txt;
	return p;
}

const dmCss = {
	/*CSS classes*/
	dmUlist: "dm-ul",
	dmNumber: "dm-number",
	dmString: "dm-string",
	dmBool: "dm-bool",
	dmIndex: "dm-index",
	dmQuotation: "dm-quotation",
	dmString: "dm-string",
	dmPointer: "dm-pointer",
	dmDataType: "dm-data-type",
	dmNull: "dm-null",
	dmBtnOpen: "dm-btn-open",
	dmBtnOpened: "dm-btn-opened",
	dmDataTypeValue: "dm-dt",
	dmKeyword: "dm-keyword"
}
function dataMirror(data, name = "", pointer = "", showTypeofValue = true) {
	const ul = document.createElement("ul");
	ul.className = dmCss.dmUlist;
	ul.style.listStyle = "none"
	const dataType = typeof data;
	const liRoot = document.createElement("li");
	liRoot.style.listStyle = "none"
	liRoot.className = "dm-li";
	const el = span(``, dmCss.dmIndex)

	renderAll(el, span(`${name}`, "label"), span(`${pointer}`, dmCss.dmPointer))
	if (data === null) {
		return (render(liRoot, renderAll(el, span(`null`, dmCss.dmKeyword),
			span(dataType, dmCss.dmDataTypeValue)
		)))}
	if (data === undefined) {
		return (render(liRoot, renderAll(el, span(`undefined`, dmCss.dmKeyword),
			span(dataType, dmCss.dmDataTypeValue)
		)))}
	if (dataType === "boolean") {
		return (render(liRoot, renderAll(el, span(`${data}`, dmCss.dmKeyword),
			span(dataType, dmCss.dmDataTypeValue)
		)))}
	if (dataType === "number") {
		let className = dmCss.dmNumber;
		if (isNaN(data))
			className = dmCss.dmKeyword;
		return (render(liRoot, renderAll(el, span(`${data}`, className),
			span(showTypeofValue ? "Typeof number": "", dmCss.dmDataTypeValue)
		)))
	}
	if (dataType === "string") {
		return render(liRoot, renderAll(el, span(`"`, dmCss.dmQuotation),
			span(data, dmCss.dmString),
			span(`"`, dmCss.dmQuotation),
			span(showTypeofValue ? "Typeof string": "", dmCss.dmDataTypeValue)
		))
	} if (dataType === "function") {
		const code = document.createElement("code");
		const pre = document.createElement("pre");

		pre.className = "pre-function"
		pre.textContent = data.toString();
		render(code, pre)
		el.classList.add("dm-btn-open")
		return (renderAll(liRoot,
			renderAll(el, span(` ${dataType}`, dmCss.dmKeyword),
				span("(", "leftBracket bracket"),
				span("", "dm-arrow"),
				span(")", "rightBracket bracket"),
				span(`${data.constructor.name}`, "dm-constructor-name")
			), code))
	}
	if (dataType === "object") {
		el.classList.add("dm-btn-open")
		const constructor = data.constructor.name;
		if (isHTML(data)) {
			el.classList.add("dm-btn-open")

			const code = document.createElement("code");
			const pre = document.createElement("pre");
			pre.innerHTML = htmlToCode(data);
			render(code, pre)
			renderAll(liRoot,
				renderAll(el, span(`${data.constructor.name}`, dmCss.dmKeyword),
					span("<", "leftBracket bracket"),
					span("", "dm-arrow"),
					span(">", "rightBracket bracket"), span(`HTMLEelement`, "dm-constructor-name")
				), code)
			return liRoot;

		}
		let leftBracket = "{";
		let rightBracket = "}";
		let type = "object";
		let point = ":";
		let length = "";
		if (Array.isArray(data)) {
			leftBracket = "[";
			rightBracket = "]";
			type = "array";
			point = "=>";
			length = data.length;
		}
		render(liRoot, renderAll(el, span(`${type} ${length}`, dmCss.dmDataType),
			span(leftBracket, "leftBracket bracket"),
			span("", "dm-arrow")));
		if (constructor === "Number") {
			render(liRoot, render(ul, dataMirror(data + 0, "", "", false)))
		} else
			if (constructor === "String") {
			render(liRoot, render(ul, dataMirror(data + "", "", "", false)))
		} else
			for (const key in data) {
			if (Object.hasOwnProperty.call(data, key))
				render(liRoot, render(ul, dataMirror(data[key], key, point)))
		}
		return(renderAll(liRoot, span(rightBracket, "rightBracket bracket"),
			span(`instanceOf ${data.constructor.name}`, "dm-constructor-name")))
	}
	return liRoot;
}

function htmlToCode(element) {
	if (!element) {
		return "";
	}
	let htmlCode = "";
	htmlCode += `<span class="tag">&lt;${element.tagName.toLowerCase()}</span>`;
	for (const attribute of element.attributes) {
		htmlCode += `<span class="attr"> ${attribute.name}<span>="</span><span class="attr-value">${attribute.value}</span>"</span>`;
	}
	htmlCode += '<span class="tag">></span>';

	if (element.childNodes.length > 0) {
		for (const child of element.childNodes) {
			if (child.nodeType === Node.TEXT_NODE) {
				htmlCode += child.textContent.replace(/</g, "&lth;");
			} else {
				htmlCode += htmlToCode(child);
			}}
	}
	htmlCode += `<span class="tag">&lt;/${element.tagName.toLowerCase()}></span>  `;
	return htmlCode;
}

/*#######$$$$##*/
function dm(data, label = "") {
	
		const mirror = document.createElement("div")
		mirror.classList.add("mirror");
		mirror.appendChild(p(label))
		mirror.appendChild(dataMirror(data));
		document.body.appendChild(mirror);
	const btns = document.querySelectorAll(".dm-btn-open, dm-data-type");
	btns.forEach((btn) => {
		btn.onclick = function () {
			this.classList.toggle("dm-btn-opened")
		}
	})
}



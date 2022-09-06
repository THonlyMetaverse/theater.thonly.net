const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/to-body/shadow.css">
    <slot></slot>
`;

export default template;
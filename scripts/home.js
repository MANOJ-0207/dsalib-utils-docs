'use strict';

// ============================
// THEME MANAGEMENT MODULE
// (keeps behavior identical to working doc.js)
// ============================
const ThemeManager = {
    applySavedTheme() {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = savedTheme || (prefersDark ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", theme);
    },

    toggleTheme() {
        const root = document.documentElement;
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    },

    init() {
        this.applySavedTheme();
        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            // avoid duplicate listeners if init called multiple times
            if (!themeToggle._themeListenerAttached) {
                themeToggle.addEventListener("click", () => this.toggleTheme());
                themeToggle._themeListenerAttached = true;
            }
        }
    }
};

// ============================
// ACCORDION ANIMATION MODULE
// ============================
const AccordionAnimator = {
    expand(panel, chevron) {
        panel.classList.add('opening');
        panel.style.height = '0px';
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';

        const height = panel.scrollHeight + 'px';

        requestAnimationFrame(() => {
            panel.style.height = height;
        });

        panel.addEventListener('transitionend', function onEnd(e) {
            if (e.propertyName === 'height') {
                panel.classList.remove('opening');
                panel.classList.add('open');
                panel.style.height = 'auto';
                panel.removeEventListener('transitionend', onEnd);

                // Ensure all child accordions are closed when parent opens
                AccordionAnimator.ensureChildAccordionsClosed(panel);
            }
        });

        if (chevron) chevron.textContent = '▾';
    },

    collapse(panel, chevron) {
        // Close all child accordions first
        this.closeAllChildAccordions(panel);

        panel.classList.add('closing');

        // Set fixed height before collapsing
        panel.style.height = panel.scrollHeight + 'px';

        requestAnimationFrame(() => {
            panel.style.height = '0px';
        });

        panel.addEventListener('transitionend', function onEnd(e) {
            if (e.propertyName === 'height') {
                panel.classList.remove('closing', 'open');
                panel.style.height = '';
                panel.style.visibility = 'hidden';
                panel.style.pointerEvents = 'none';
                panel.removeEventListener('transitionend', onEnd);
            }
        });

        if (chevron) chevron.textContent = '▸';
    },

    closeAllChildAccordions(parentPanel) {
        const childPanels = parentPanel.querySelectorAll('.accordion-panel.open');
        childPanels.forEach(childPanel => {
            const parentButton = childPanel.previousElementSibling;
            if (parentButton && parentButton.classList.contains('accordion-btn')) {
                const childChevron = parentButton.querySelector('.chevron');

                // Directly close without animation for cleaner UX
                childPanel.classList.remove('open', 'opening', 'closing');
                childPanel.style.height = '';
                childPanel.style.visibility = 'hidden';
                childPanel.style.pointerEvents = 'none';

                if (childChevron) childChevron.textContent = '▸';
            }
        });
    },

    ensureChildAccordionsClosed(parentPanel) {
        setTimeout(() => {
            this.closeAllChildAccordions(parentPanel);
        }, 50);
    },

    toggleAccordion(button) {
        const panel = button.nextElementSibling;
        const chevron = button.querySelector('.chevron');

        if (panel.classList.contains('open')) {
            this.collapse(panel, chevron);
        } else {
            this.expand(panel, chevron);
        }
    }
};

// ============================
// DOCUMENTATION DATA
// ============================
const DOC_DATA = {
    cache: {
        type: 'package',
        items: [
            { name: 'Cache', type: 'interface', path: 'docs/cache/Cache.html' },
            { name: 'AbstractCache', type: 'abstract', path: 'docs/cache/AbstractCache.html' },
            { name: 'FIFOCache', type: 'class', path: 'docs/cache/FIFOCache.html' },
            { name: 'LFUCache', type: 'class', path: 'docs/cache/LFUCache.html' },
            { name: 'LRUCache', type: 'class', path: 'docs/cache/LRUCache.html' },
            { name: 'SegmentedLRUCache', type: 'class', path: 'docs/cache/SegmentedLRUCache.html' }
        ]
    },
    graph: {
        type: 'package',
        items: {
            disjointset: {
                type: 'package',
                items: [
                    { name: 'DisjointSet', type: 'class', path: 'docs/graph/disjointset/DisjointSet.html' }
                ]
            },
            unweightedgraph: {
                type: 'package',
                items: [
                    { name: 'SimpleGraph', type: 'interface', path: 'docs/graph/unweightedgraph/SimpleGraph.html' },
                    { name: 'Edge', type: 'record', path: 'docs/graph/unweightedgraph/Edge.html' },
                    { name: 'AdjListSimpleGraph', type: 'class', path: 'docs/graph/unweightedgraph/AdjListSimpleGraph.html' },
                    { name: 'AdjMatrixSimpleGraph', type: 'class', path: 'docs/graph/unweightedgraph/AdjMatrixSimpleGraph.html' }
                ]
            },
            weightedgraph: {
                type: 'package',
                items: {
                    edge: {
                        type: 'package',
                        items: [
                            { name: 'DetailedEdge', type: 'record', path: 'docs/graph/weightedgraph/edge/DetailedEdge.html' },
                            { name: 'WeightedEdge', type: 'record', path: 'docs/graph/weightedgraph/edge/WeightedEdge.html' }
                        ]
                    },
                    WeightedGraph: { name: 'WeightedGraph', type: 'interface', path: 'docs/graph/weightedgraph/WeightedGraph.html' },
                    AdjListWeightedGraph: { name: 'AdjListWeightedGraph', type: 'class', path: 'docs/graph/weightedgraph/AdjListWeightedGraph.html' },
                    AdjMatrixWeightedGraph: { name: 'AdjMatrixWeightedGraph', type: 'class', path: 'docs/graph/weightedgraph/AdjMatrixWeightedGraph.html' }
                }
            }
        }
    },
    heap: {
        type: 'package',
        items: [
            { name: 'EfficientHeap', type: 'class', path: 'docs/heap/EfficientHeap.html' }
        ]
    },
    math: {
        type: 'package',
        items: {
            combinatorics: {
                type: 'package',
                items: [
                    { name: 'FactorialUtils', type: 'class', path: 'docs/math/combinatorics/FactorialUtils.html' },
                    { name: 'PascalTriangleUtils', type: 'class', path: 'docs/math/combinatorics/PascalTriangleUtils.html' }
                ]
            },
            numbertheory: {
                type: 'package',
                items: [
                    { name: 'ModMath', type: 'class', path: 'docs/math/numbertheory/ModMath.html' },
                    { name: 'NumberTheoryUtils', type: 'class', path: 'docs/math/numbertheory/NumberTheoryUtils.html' },
                    { name: 'PrimeUtils', type: 'class', path: 'docs/math/numbertheory/PrimeUtils.html' }
                ]
            }
        }
    },
    rangequery: {
        type: 'package',
        items: {
            segmenttree: {
                type: 'package',
                items: [
                    { name: 'SegmentTree', type: 'interface', path: 'docs/rangequery/segmenttree/SegmentTree.html' },
                    { name: 'GenericEagerSegmentTree', type: 'class', path: 'docs/rangequery/segmenttree/GenericEagerSegmentTree.html' },
                    { name: 'GenericLazySegmentTree', type: 'class', path: 'docs/rangequery/segmenttree/GenericLazySegmentTree.html' }
                ]
            },
            Generic2DSparseTable: { name: 'Generic2DSparseTable', type: 'class', path: 'docs/rangequery/Generic2DSparseTable.html' },
            GenericSparseTable: { name: 'GenericSparseTable', type: 'class', path: 'docs/rangequery/GenericSparseTable.html' },
            OrderStatisticSet: { name: 'OrderStatisticSet', type: 'class', path: 'docs/rangequery/OrderStatisticSet.html' },
            OrderStatisticTree: { name: 'OrderStatisticTree', type: 'class', path: 'docs/rangequery/OrderStatisticTree.html' }
        }
    },
    stringutils: {
        type: 'package',
        items: {
            pattern: {
                type: 'package',
                items: [
                    { name: 'PatternMatcher', type: 'interface', path: 'docs/stringutils/pattern/PatternMatcher.html' },
                    { name: 'AbstractPatternMatcher', type: 'abstract', path: 'docs/stringutils/pattern/AbstractPatternMatcher.html' },
                    { name: 'KMPMatcher', type: 'class', path: 'docs/stringutils/pattern/KMPMatcher.html' },
                    { name: 'RabinKarpMatcher', type: 'class', path: 'docs/stringutils/pattern/RabinKarpMatcher.html' },
                    { name: 'ZAlgorithmMatcher', type: 'class', path: 'docs/stringutils/pattern/ZAlgorithmMatcher.html' }
                ]
            },
            Trie: { name: 'Trie', type: 'class', path: 'docs/stringutils/Trie.html' },
            TrieNode: { name: 'TrieNode', type: 'class', path: 'docs/stringutils/TrieNode.html' }
        }
    },
    tree: {
        type: 'package',
        items: [
            { name: 'GenericTree', type: 'class', path: 'docs/tree/GenericTree.html' }
        ]
    }
};

// ============================
// SVG ICON FACTORY
// ============================
const SVGIconFactory = {
    createSVGElement(tagName, attributes = {}) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    },

    createInterfaceIcon() {
        const svg = this.createSVGElement('svg', { class: 'svg', width: '20', height: '20', viewBox: '0 0 40 40' });
        const circle = this.createSVGElement('circle', { cx: '20', cy: '20', r: '18', stroke: 'currentColor', 'stroke-width': '2', fill: 'none' });
        const group = this.createSVGElement('g', { fill: 'currentColor' });
        const rect1 = this.createSVGElement('rect', { x: '17', y: '10', width: '6', height: '2' });
        const rect2 = this.createSVGElement('rect', { x: '19', y: '12', width: '2', height: '12' });
        const rect3 = this.createSVGElement('rect', { x: '17', y: '24', width: '6', height: '2' });
        group.appendChild(rect1);
        group.appendChild(rect2);
        group.appendChild(rect3);
        svg.appendChild(circle);
        svg.appendChild(group);
        return svg;
    },

    createClassIcon() {
        const svg = this.createSVGElement('svg', { class: 'svg', width: '20', height: '20', viewBox: '0 0 40 40' });
        const circle = this.createSVGElement('circle', { cx: '20', cy: '20', r: '18', stroke: 'currentColor', 'stroke-width': '2', fill: 'none' });
        const text = this.createSVGElement('text', { x: '20', y: '27', 'text-anchor': 'middle', 'font-size': '20', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold', fill: 'currentColor' });
        text.textContent = 'C';
        svg.appendChild(circle);
        svg.appendChild(text);
        return svg;
    },

    createAbstractIcon() {
        const svg = this.createSVGElement('svg', { class: 'svg', width: '20', height: '20', viewBox: '0 0 40 40' });
        const circle = this.createSVGElement('circle', { cx: '20', cy: '20', r: '18', stroke: 'currentColor', 'stroke-width': '2', fill: 'none' });
        const text = this.createSVGElement('text', { x: '20', y: '27', 'text-anchor': 'middle', 'font-size': '20', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold', fill: 'currentColor' });
        text.textContent = 'A';
        svg.appendChild(circle);
        svg.appendChild(text);
        return svg;
    },

    createRecordIcon() {
        const svg = this.createSVGElement('svg', { class: 'svg', width: '20', height: '20', viewBox: '0 0 40 40' });
        const circle = this.createSVGElement('circle', { cx: '20', cy: '20', r: '18', stroke: 'currentColor', 'stroke-width': '2', fill: 'none' });
        const text = this.createSVGElement('text', { x: '20', y: '27', 'text-anchor': 'middle', 'font-size': '20', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold', fill: 'currentColor' });
        text.textContent = 'R';
        svg.appendChild(circle);
        svg.appendChild(text);
        return svg;
    },

    getIcon(type) {
        switch (type) {
            case 'interface': return this.createInterfaceIcon();
            case 'abstract': return this.createAbstractIcon();
            case 'record': return this.createRecordIcon();
            case 'class':
            default: return this.createClassIcon();
        }
    }
};

// ============================
// DOM ELEMENT FACTORY
// ============================
const DOMElementFactory = {
    createChevron(direction = '▸') {
        const chevron = document.createElement('span');
        chevron.className = 'chevron';
        chevron.textContent = direction;
        return chevron;
    },

    createPackageName(packageName) {
        const strong = document.createElement('strong');
        strong.textContent = `📦 ${packageName}`;
        return strong;
    },

    createAccordionButton(packageName, clickHandler) {
        const button = document.createElement('button');
        button.className = 'accordion-btn';
        button.addEventListener('click', clickHandler);

        const chevron = this.createChevron();
        const packageNameElement = this.createPackageName(packageName);

        button.appendChild(chevron);
        button.appendChild(document.createTextNode(' '));
        button.appendChild(packageNameElement);

        return button;
    },

    createAccordionPanel() {
        const panel = document.createElement('div');
        panel.className = 'accordion-panel';
        return panel;
    },

    createDocumentationLink(item) {
        const link = document.createElement('a');
        link.href = item.path;
        link.className = `doc-link ${item.type}-link`;
        link.target = '_blank';

        const icon = SVGIconFactory.getIcon(item.type);
        const textNode = document.createTextNode(item.name);

        link.appendChild(icon);
        link.appendChild(document.createTextNode(' '));
        link.appendChild(textNode);

        return link;
    },

    createHeading(text) {
        const heading = document.createElement('h3');
        heading.textContent = text;
        return heading;
    },

    createAccordionSection() {
        const section = document.createElement('section');
        section.className = 'accordion';
        return section;
    }
};

// ============================
// ACCORDION NAVIGATION MODULE
// ============================
const AccordionNavigation = {
    createAccordion(data, container) {
        Object.keys(data).forEach(key => {
            const item = data[key];

            if (item.type === 'package') {
                this.createPackageSection(key, item, container);
            } else if (item.name) {
                const link = DOMElementFactory.createDocumentationLink(item);
                container.appendChild(link);
            }
        });
    },

    createPackageSection(packageName, packageData, container) {
        const button = DOMElementFactory.createAccordionButton(
            packageName,
            () => AccordionAnimator.toggleAccordion(button)
        );

        const panel = DOMElementFactory.createAccordionPanel();

        this.processPackageItems(packageData.items, panel);

        container.appendChild(button);
        container.appendChild(panel);
    },

    processPackageItems(items, panel) {
        if (Array.isArray(items)) {
            items.forEach(docItem => {
                const link = DOMElementFactory.createDocumentationLink(docItem);
                panel.appendChild(link);
            });
        } else {
            this.createAccordion(items, panel);
        }
    },

    init() {
        const container = document.getElementById('container');
        if (!container) {
            console.error('Container element with ID "container" not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Create and append heading
        const heading = DOMElementFactory.createHeading('Package Structure');
        container.appendChild(heading);

        // Create accordion wrapper
        const accordionElement = DOMElementFactory.createAccordionSection();

        // Populate the accordion with data
        this.createAccordion(DOC_DATA, accordionElement);

        // Append to container
        container.appendChild(accordionElement);

        console.log('Documentation navigation populated successfully');
    }
};

// ============================
// CODE SNIPPET MODULE
// - minimal, self-contained, inserts snippet above package structure
// ============================
const CodeSnippetModule = (function() {
    const MAVEN_SNIPPET = `
<!-- This will include the Java Generic DSA Utils library (io.github.manoj-0207:dsalib-utils) -->
<dependency>
    <groupId>io.github.manoj-0207</groupId>
    <artifactId>dsalib-utils</artifactId>
    <version>1.0.0</version>
</dependency>`;

    // small SVGs as strings to keep module compact
    const COPY_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.25" fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9" stroke="currentColor" stroke-width="1.25" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const CHECK_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 12.5 L10.5 15.5 L16 9.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const FAIL_SVG  = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9 9 L15 15 M15 9 L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>`;

    function createSection() {
        const section = document.createElement('section');
        section.className = 'code-snippet';

        // heading
        const h3 = document.createElement('h3');
        h3.innerHTML = `<span class="maven-logo" aria-hidden="true">Ⓜ</span> Maven Dependency`; // keep logo minimal - your CSS can replace
        section.appendChild(h3);

        // description
        const p = document.createElement('p');
        p.className = 'snippet-desc';
        p.textContent = "Copy this snippet into your pom.xml to add the Java Generic DSA Utils library.";
        p.style.margin = '0 0 0.6rem 0';
        section.appendChild(p);

        // code block
        const block = document.createElement('div');
        block.className = 'code-block';
        block.style.position = 'relative';

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.id = 'maven-code';
        code.textContent = MAVEN_SNIPPET;
        pre.appendChild(code);
        block.appendChild(pre);

        // copy button
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-btn';
        button.setAttribute('aria-label', 'Copy maven dependency to clipboard');

        const iconWrap = document.createElement('span');
        iconWrap.className = 'icon';
        iconWrap.innerHTML = COPY_SVG;

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = 'Copy';

        button.appendChild(iconWrap);
        button.appendChild(label);

        button.addEventListener('click', async () => {
            await copyToClipboard(MAVEN_SNIPPET, button, iconWrap, label);
        });

        block.appendChild(button);
        section.appendChild(block);

        return section;
    }

    async function copyToClipboard(text, button, iconWrap, label) {
        // remember original
        const originalHTML = iconWrap.innerHTML;
        const originalLabel = label.textContent;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }

            // success state
            button.classList.add('copied');
            iconWrap.innerHTML = CHECK_SVG;
            label.textContent = 'Copied';

            setTimeout(() => {
                button.classList.remove('copied');
                iconWrap.innerHTML = originalHTML;
                label.textContent = originalLabel;
            }, 2000);
        } catch (err) {
            console.error('Copy failed', err);
            button.classList.add('copied');
            iconWrap.innerHTML = FAIL_SVG;
            label.textContent = 'Failed';
            setTimeout(() => {
                button.classList.remove('copied');
                iconWrap.innerHTML = originalHTML;
                label.textContent = originalLabel;
            }, 2000);
        }
    }

    return {
        init() {
            const container = document.getElementById('container');
            if (!container) return;

            // create section
            const section = createSection();

            // find the first heading (Package Structure) — we want snippet ABOVE it
            const firstHeading = container.querySelector('h3');
            if (firstHeading && firstHeading.parentNode === container) {
                container.insertBefore(section, firstHeading);
            } else {
                // fallback: prepend to container
                container.prepend(section);
            }
        },

        setSnippet(newSnippet) {
            const codeEl = document.getElementById('maven-code');
            if (codeEl) codeEl.textContent = newSnippet;
        }
    };
})();

// ============================
// APPLICATION INITIALIZATION
// ============================
const App = {
    init() {
        console.log('Initializing application...');
        ThemeManager.init();
        AccordionNavigation.init();
        CodeSnippetModule.init(); // add snippet without changing other logic
        console.log('Application initialized successfully');
    }
};

// ============================
// DOM READY EVENT LISTENER
// ============================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

"use client";

export interface SplitTextOptions {
  type?: "chars" | "words" | "lines" | "chars,words" | "words,lines" | "chars,words,lines";
  charsClass?: string;
  wordsClass?: string;
  linesClass?: string;
}

export interface SplitTextResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];
  revert: () => void;
}

/**
 * Custom SplitText utility - Free alternative to GSAP's SplitText plugin
 * Splits text content into chars, words, and/or lines for animation
 */
export function splitText(
  element: HTMLElement | string,
  options: SplitTextOptions = {}
): SplitTextResult {
  const {
    type = "chars,words,lines",
    charsClass = "split-char",
    wordsClass = "split-word",
    linesClass = "split-line",
  } = options;

  const el = typeof element === "string" ? document.querySelector<HTMLElement>(element) : element;

  if (!el) {
    console.warn("SplitText: Element not found");
    return { chars: [], words: [], lines: [], revert: () => {} };
  }

  const originalHTML = el.innerHTML;
  const text = el.textContent || "";
  const types = type.split(",").map((t) => t.trim());

  const includeChars = types.includes("chars");
  const includeWords = types.includes("words");
  const includeLines = types.includes("lines");

  const chars: HTMLElement[] = [];
  const words: HTMLElement[] = [];
  const lines: HTMLElement[] = [];

  // Split into words first
  const wordTexts = text.split(/\s+/).filter((w) => w.length > 0);

  let htmlContent = "";

  wordTexts.forEach((wordText, wordIndex) => {
    let wordContent = "";

    if (includeChars) {
      // Split word into characters
      wordText.split("").forEach((char) => {
        wordContent += `<span class="${charsClass}" style="display: inline-block;">${char}</span>`;
      });
    } else {
      wordContent = wordText;
    }

    if (includeWords) {
      htmlContent += `<span class="${wordsClass}" style="display: inline-block;">${wordContent}</span>`;
    } else {
      htmlContent += wordContent;
    }

    // Add space between words (except last)
    if (wordIndex < wordTexts.length - 1) {
      htmlContent += " ";
    }
  });

  // Apply the split HTML
  el.innerHTML = htmlContent;

  // Collect references
  if (includeChars) {
    chars.push(...Array.from(el.querySelectorAll<HTMLElement>(`.${charsClass}`)));
  }

  if (includeWords) {
    words.push(...Array.from(el.querySelectorAll<HTMLElement>(`.${wordsClass}`)));
  }

  // Line detection (based on vertical position)
  if (includeLines) {
    const elements = includeWords
      ? words
      : includeChars
        ? chars
        : Array.from(el.querySelectorAll<HTMLElement>("span"));

    if (elements.length > 0) {
      let currentLineTop = elements[0].offsetTop;
      let currentLineElements: HTMLElement[] = [];

      elements.forEach((elem, index) => {
        if (elem.offsetTop !== currentLineTop) {
          // Wrap previous line
          if (currentLineElements.length > 0) {
            const lineWrapper = wrapElements(currentLineElements, linesClass);
            if (lineWrapper) lines.push(lineWrapper);
          }
          currentLineTop = elem.offsetTop;
          currentLineElements = [elem];
        } else {
          currentLineElements.push(elem);
        }

        // Handle last line
        if (index === elements.length - 1 && currentLineElements.length > 0) {
          const lineWrapper = wrapElements(currentLineElements, linesClass);
          if (lineWrapper) lines.push(lineWrapper);
        }
      });
    }
  }

  // Revert function to restore original HTML
  const revert = () => {
    el.innerHTML = originalHTML;
  };

  return { chars, words, lines, revert };
}

/**
 * Wraps elements in a line wrapper
 */
function wrapElements(elements: HTMLElement[], className: string): HTMLElement | null {
  if (elements.length === 0) return null;

  const parent = elements[0].parentNode;
  if (!parent) return null;

  const wrapper = document.createElement("div");
  wrapper.className = className;
  wrapper.style.display = "block";

  // Insert wrapper before first element
  parent.insertBefore(wrapper, elements[0]);

  // Move elements into wrapper
  elements.forEach((el) => wrapper.appendChild(el));

  return wrapper;
}

export default splitText;

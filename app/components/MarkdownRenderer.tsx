import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  // Enhanced markdown parser with comprehensive support
  const parseMarkdown = (text: string) => {
    // Split into lines for better processing
    const lines = text.split('\n');
    let processedLines: string[] = [];
    let inCodeBlock = false;
    let inTable = false;
    let inList = false;
    let listType = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          const language = trimmedLine.slice(3).trim();
          processedLines.push(`<div class="my-3 p-3 bg-[#1E1E1E] border border-[#3a3a3a] rounded-lg overflow-x-auto"><pre class="text-sm font-mono text-gray-300"><code class="language-${language || 'text'}">`);
        } else {
          inCodeBlock = false;
          processedLines.push('</code></pre></div>');
        }
        continue;
      }
      
      if (inCodeBlock) {
        processedLines.push(line);
        continue;
      }
      
      // Handle headers with proper spacing
      if (trimmedLine.startsWith('#### ')) {
        processedLines.push(`<h4 class="text-lg font-semibold text-white mt-4 mb-2">${trimmedLine.slice(5)}</h4>`);
        continue;
      }
      if (trimmedLine.startsWith('### ')) {
        processedLines.push(`<h3 class="text-xl font-semibold text-white mt-4 mb-2">${trimmedLine.slice(4)}</h3>`);
        continue;
      }
      if (trimmedLine.startsWith('## ')) {
        processedLines.push(`<h2 class="text-2xl font-semibold text-white mt-4 mb-2">${trimmedLine.slice(3)}</h2>`);
        continue;
      }
      if (trimmedLine.startsWith('# ')) {
        processedLines.push(`<h1 class="text-3xl font-bold text-white mt-4 mb-2">${trimmedLine.slice(2)}</h1>`);
        continue;
      }
      
      // Handle horizontal rules
      if (trimmedLine.match(/^[-*_]{3,}$/)) {
        processedLines.push('<hr class="my-3 border-gray-600">');
        continue;
      }
      
      // Handle blockquotes
      if (trimmedLine.startsWith('> ')) {
        processedLines.push(`<blockquote class="border-l-4 border-gray-500 pl-3 py-2 my-2 bg-gray-800/50 text-gray-300 italic rounded-r">${trimmedLine.slice(2)}</blockquote>`);
        continue;
      }
      
      // Handle tables
      if (trimmedLine.includes('|') && !inTable) {
        inTable = true;
        processedLines.push(parseTableFromLines(lines.slice(i)));
        // Skip table lines
        while (i < lines.length && lines[i].includes('|')) {
          i++;
        }
        i--; // Adjust for the loop increment
        inTable = false;
        continue;
      }
      
      // Handle lists
      if (trimmedLine.match(/^[\s]*[-*+] /) || trimmedLine.match(/^[\s]*\d+\. /)) {
        if (!inList) {
          inList = true;
          listType = trimmedLine.match(/^[\s]*\d+\. /) ? 'ol' : 'ul';
          processedLines.push(`<${listType} class="my-2 space-y-1">`);
        }
        
        const indentLevel = (line.match(/^[\s]*/)?.[0] || '').length;
        const content = trimmedLine.replace(/^[\s]*[-*+\d.] /, '');
        processedLines.push(`<li class="ml-${Math.min(indentLevel / 2, 8)} text-gray-200">${content}</li>`);
        continue;
      } else if (inList) {
        inList = false;
        processedLines.push(`</${listType}>`);
      }
      
      // Handle empty lines
      if (trimmedLine === '') {
        processedLines.push('<br>');
        continue;
      }
      
      // Handle regular paragraphs
      processedLines.push(`<p class="mb-2 text-gray-200 leading-relaxed">${line}</p>`);
    }
    
    // Close any open lists
    if (inList) {
      processedLines.push(`</${listType}>`);
    }
    
    // Join and process inline formatting
    let result = processedLines.join('\n');
    
    // Process inline formatting
    result = processInlineFormatting(result);
    
    return result;
  };

  // Process inline formatting (bold, italic, links, etc.)
  const processInlineFormatting = (text: string) => {
    // Handle bold text **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong class="font-semibold text-white">$1</strong>');
    
    // Handle italic text *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
    text = text.replace(/_(.*?)_/g, '<em class="italic text-gray-300">$1</em>');
    
    // Handle strikethrough ~~text~~
    text = text.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-400">$1</del>');
    
    // Handle inline code `code`
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-sm font-mono text-gray-200">$1</code>');
    
    // Handle links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Handle images ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
    
    return text;
  };

  // Parse table from lines
  const parseTableFromLines = (lines: string[]) => {
    const tableLines = lines.filter(line => line.trim().includes('|'));
    if (tableLines.length < 2) return '';
    
    const headerRow = tableLines[0];
    const separatorRow = tableLines[1];
    const dataRows = tableLines.slice(2);
    
    // Parse header
    const headerCells = headerRow.split('|').map(cell => cell.trim()).filter(cell => cell);
    
    // Parse data rows
    const tableRows = dataRows.map(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      return cells;
    });
    
    // Generate HTML table
    let tableHtml = '<div class="my-3 overflow-x-auto"><table class="min-w-full border-collapse border border-gray-600 bg-gray-800 rounded-lg overflow-hidden">';
    
    // Header
    tableHtml += '<thead class="bg-gray-700">';
    tableHtml += '<tr>';
    headerCells.forEach(cell => {
      tableHtml += `<th class="border border-gray-600 px-3 py-2 text-left text-sm font-semibold text-white">${cell}</th>`;
    });
    tableHtml += '</tr>';
    tableHtml += '</thead>';
    
    // Body
    tableHtml += '<tbody>';
    tableRows.forEach((row, index) => {
      const rowClass = index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750';
      tableHtml += `<tr class="${rowClass} hover:bg-gray-700 transition-colors">`;
      row.forEach(cell => {
        tableHtml += `<td class="border border-gray-600 px-3 py-2 text-sm text-gray-200">${cell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody>';
    
    tableHtml += '</table></div>';
    
    return tableHtml;
  };


  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: parseMarkdown(content) 
      }}
    />
  );
};

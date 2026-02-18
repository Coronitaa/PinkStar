'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCodeHighlightTheme } from '@/components/providers/CodeHighlightThemeProvider';
import { useEditor, EditorContent, BubbleMenu, type Editor, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type NodeViewProps, Node, mergeAttributes, type CommandProps, type RawCommands } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from '@/lib/lowlight';
import {
  Bold, Italic, Link as LinkIcon, List, ListOrdered, Strikethrough, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Image as ImageIcon, Video, Palette, RotateCw, ImagePlus, Box, GalleryHorizontal, GripVertical, Trash2, Edit, Code as CodeIcon, ClipboardCopy, Settings, Check, ChevronUp, ChevronDown
} from 'lucide-react';
import { GradientPicker } from './GradientPicker';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { parseMediaUrl } from '@/lib/utils';
import { ResourceImageEditor } from '@/components/admin/ResourceImageEditor';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';

// --- Extensions ---

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        class?: string;
      }, HTMLElement>;
    }
  }
}

export interface FontFamilyOptions {
  types: string[],
}

export interface FontSizeOptions {
  types: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (font: string) => ReturnType,
      unsetFontFamily: () => ReturnType,
    }
    fontSize: {
      setFontSize: (size: string) => ReturnType,
      unsetFontSize: () => ReturnType,
    }
    modelViewer: {
      setModelViewer: (options: { src: string }) => ReturnType,
    }
    iframe: {
      setIframe: (options: { src: string, width?: string, height?: string }) => ReturnType,
    }
    imageCarousel: {
      setImageCarousel: (options: { images: string[], width?: string, aspectRatio?: string, autoplayInterval?: number }) => ReturnType,
    }
    customCodeBlock: {
      setCustomCodeBlock: (attributes?: { language?: string; title?: string; maxHeight?: string }) => ReturnType,
      toggleCustomCodeBlock: (attributes?: { language?: string; title?: string; maxHeight?: string }) => ReturnType,
    }
    textGradient: {
      setTextGradient: (gradient: string) => ReturnType,
      unsetTextGradient: () => ReturnType,
    }
  }
}

export const FontFamily = Extension.create<FontFamilyOptions>({
  name: 'fontFamily',
  addOptions() { return { types: ['textStyle'] } },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontFamily: {
          default: null,
          parseHTML: element => element.style.fontFamily?.replace(/['"]+/g, ''),
          renderHTML: attributes => {
            if (!attributes.fontFamily) return {};
            return { style: `font-family: ${attributes.fontFamily}` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontFamily: fontFamily => ({ chain }) => {
        return chain().setMark('textStyle', { fontFamily }).run();
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontFamily: null }).run();
      },
    }
  },
});

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] } },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
          renderHTML: attributes => {
            if (!attributes.fontSize) return {};
            return { style: `font-size: ${attributes.fontSize}` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).run();
      },
    }
  },
});

export const TextGradient = Extension.create<any>({
  name: 'textGradient',
  addOptions() { return { types: ['textStyle'] } },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        textGradient: {
          default: null,
          parseHTML: element => element.style.backgroundImage,
          renderHTML: attributes => {
            if (!attributes.textGradient) return {};
            const regex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\([^)]+\))/i;
            const matches = attributes.textGradient.match(regex);
            const firstColor = matches ? matches[0] : 'hsl(var(--accent))';
            return {
              class: 'has-text-gradient',
              style: `background-image: ${attributes.textGradient}; --first-gradient-color: ${firstColor}; color: transparent; -webkit-background-clip: text; background-clip: text;`,
            };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setTextGradient: (gradient: string) => ({ chain, editor }: CommandProps) => {
        const { fontFamily, fontSize } = editor.getAttributes('textStyle');
        return chain().setMark('textStyle', { textGradient: gradient, fontFamily, fontSize }).run();
      },
      unsetTextGradient: () => ({ chain, editor }: CommandProps) => {
        const { fontFamily, fontSize } = editor.getAttributes('textStyle');
        return chain().setMark('textStyle', { textGradient: null, fontFamily, fontSize }).run();
      },
    }
  },
});

// --- Media Components ---

const handles = [
  { pos: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', direction: 'top-left' },
  { pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', direction: 'top' },
  { pos: 'top-0 right-0 translate-x-1/2 -translate-y-1/2', direction: 'top-right' },
  { pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', direction: 'left' },
  { pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2', direction: 'right' },
  { pos: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', direction: 'bottom-left' },
  { pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', direction: 'bottom' },
  { pos: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', direction: 'bottom-right' },
];

const getDynamicCursor = (handleDirection: string, objectRotation: number): string => {
  const baseCursorAngles: { [key: string]: number } = {
    'top': 90, 'bottom': 90,
    'left': 0, 'right': 0,
    'top-left': 135, 'top-right': 45,
    'bottom-left': 45, 'bottom-right': 135,
  };
  const rotation = baseCursorAngles[handleDirection] + objectRotation;
  const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(${rotation} 16 16)"><path d="M4 16 H28 M4 16 L10 10 M4 16 L10 22 M28 16 L22 10 M28 16 L22 22" stroke="black" stroke-width="3.5" fill="none" stroke-linejoin="round" stroke-linecap="round" /><path d="M4 16 H28 M4 16 L10 10 M4 16 L10 22 M28 16 L22 10 M28 16 L22 22" stroke="white" stroke-width="1.5" fill="none" stroke-linejoin="round" stroke-linecap="round" /></g></svg>`.replace(/>\s+</g, '><').replace(/\s\s+/g, ' ').trim();
  const encodedSvg = encodeURIComponent(svg);
  return `url('data:image/svg+xml;charset=UTF-8,${encodedSvg}') 16 16, auto`;
};

const MediaResizeComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, selected, editor } = props;
  const isImage = node.type.name === 'image';
  const isVideo = node.type.name === 'youtube';
  const isIframe = node.type.name === 'iframe';
  const isModel = node.type.name === 'modelViewer';
  const href = node.attrs.href;

  const containerRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('top');

  useEffect(() => {
    if (selected && containerRef.current) {
      const editorViewDom = editor.view.dom;
      const editorRect = editorViewDom.getBoundingClientRect();
      const nodeRect = containerRef.current.getBoundingClientRect();
      const toolbar = editorViewDom.parentElement?.querySelector('[data-testid="rte-toolbar"]');
      const toolbarHeight = toolbar?.clientHeight || 45;
      const spaceAbove = nodeRect.top - editorRect.top;
      if (spaceAbove < toolbarHeight + 40) setMenuPosition('bottom');
      else setMenuPosition('top');
    }
  }, [selected, editor.view.dom]);

  const setAlignment = (align: 'left' | 'center' | 'right' | null) => {
    updateAttributes({ 'data-float': align });
  };

  const rotation = node.attrs.rotate || 0;
  const width = node.attrs.width;
  const height = node.attrs.height;
  const float = node.attrs['data-float'];

  const rotateByAxis = (degrees: number) => {
    updateAttributes({ rotate: (rotation + degrees) % 360 });
  };

  const handleStyles = useMemo(() => {
    return handles.map(handle => ({ cursor: getDynamicCursor(handle.direction, rotation) }));
  }, [rotation]);

  const createResizeHandler = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const startX = e.clientX; const startY = e.clientY;
    const startWidth = container.offsetWidth; const startHeight = container.offsetHeight;
    const aspectRatio = startWidth / startHeight;
    const angleRad = rotation * (Math.PI / 180);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX; const dy = moveEvent.clientY - startY;
      const cos = Math.cos(angleRad); const sin = Math.sin(angleRad);
      const dxRot = dx * cos + dy * sin; const dyRot = -dx * sin + dy * cos;
      let newWidth = startWidth; let newHeight = startHeight;
      const shouldDeform = moveEvent.shiftKey;
      if (direction.includes('right')) newWidth = startWidth + dxRot;
      if (direction.includes('left')) newWidth = startWidth - dxRot;
      if (direction.includes('bottom')) newHeight = startHeight + dyRot;
      if (direction.includes('top')) newHeight = startHeight - dyRot;
      if (!shouldDeform) {
        if (Math.abs(dxRot) > Math.abs(dyRot)) newHeight = newWidth / aspectRatio;
        else newWidth = newHeight * aspectRatio;
      }
      newWidth = Math.max(50, newWidth); newHeight = Math.max(20, newHeight);
      updateAttributes({ width: `${newWidth}px`, height: `${newHeight}px` });
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const createRotationHandler = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const container = containerRef.current; if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const initialRotation = rotation;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      updateAttributes({ rotate: (initialRotation + (currentAngle - startAngle)) % 360 });
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const imageContent = <img src={node.attrs.src} alt={node.attrs.alt} className="w-full h-full block object-fill" />;

  return (
    <NodeViewWrapper as="div" className="rich-text-media-node group clear-both relative" style={{ width }} data-float={float}>
      <div ref={containerRef} className={cn("relative w-full", selected && 'border-2 border-primary border-solid')} style={{ height: height || 'auto', transform: `rotate(${rotation}deg)` }}>
        {isImage && (href ? <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="w-full h-full block cursor-pointer" onClick={e => editor.isEditable && e.preventDefault()}>{imageContent}</a> : imageContent)}
        {(isVideo || isIframe) && <div className="w-full h-full relative"><iframe className="absolute inset-0 w-full h-full" src={node.attrs.src} frameBorder="0" allowFullScreen />{editor.isEditable && <div className={cn("absolute inset-0 z-10", selected && "cursor-move")} />}</div>}
        {isModel && <div className="w-full h-full relative"><model-viewer src={node.attrs.src} camera-controls auto-rotate className="w-full h-full rounded-md"></model-viewer>{editor.isEditable && <div className={cn("absolute inset-0 z-10", selected && "cursor-move")} />}</div>}
        {selected && (
          <>
            {handles.map((handle, index) => <div key={index} className={cn("absolute w-2.5 h-2.5 bg-primary rounded-full border border-card pointer-events-auto z-20", handle.pos)} style={handleStyles[index]} onMouseDown={createResizeHandler(handle.direction)} />)}
            <div className="absolute bottom-0 right-0 translate-x-[110%] translate-y-[110%] p-1.5 bg-card rounded-full border border-primary pointer-events-auto z-20 cursor-alias transition-transform group-hover:scale-110" onMouseDown={createRotationHandler} title="Rotate Freely"><RotateCw className="w-4 h-4 text-primary" /></div>
          </>
        )}
      </div>
      {selected && (
        <div className={cn("absolute left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-card p-1 rounded-md shadow-lg border border-border pointer-events-auto", menuPosition === 'top' ? "top-0 -translate-y-[calc(100%+12px)]" : "bottom-0 translate-y-[calc(100%+12px)]")}>
          <Button type="button" size="icon" variant={float === 'left' ? 'default' : 'ghost'} className="h-7 w-7" onClick={() => setAlignment('left')} title="Align left"><AlignLeft className="w-4 h-4" /></Button>
          <Button type="button" size="icon" variant={!float || float === 'center' ? 'default' : 'ghost'} className="h-7 w-7" onClick={() => setAlignment('center')} title="Align center"><AlignCenter className="w-4 h-4" /></Button>
          <Button type="button" size="icon" variant={float === 'right' ? 'default' : 'ghost'} className="h-7 w-7" onClick={() => setAlignment('right')} title="Align right"><AlignRight className="w-4 h-4" /></Button>
          <div className="w-px h-5 bg-border mx-1 self-center" />
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => rotateByAxis(90)} title="Rotate 90°"><RotateCw className="w-4 h-4" /></Button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

// --- Custom Code Block ---

const CodeBlockComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, editor, extension } = props;
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(node.textContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const preElement = preRef.current; if (!preElement) return;
    const startY = e.clientY; const startHeight = preElement.offsetHeight;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateAttributes({ maxHeight: `${Math.max(80, startHeight + (moveEvent.clientY - startY))}px` });
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const languages = extension.options.lowlight.listLanguages();

  return (
    <NodeViewWrapper className="not-prose my-4 relative group/code-block">
      <div className="relative border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between bg-card-foreground/5 px-2 py-1.5 border-b border-border text-xs shrink-0 select-none">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            {/* ISOLATED DRAG HANDLE */}
            <div className="cursor-grab hover:text-foreground/80 text-muted-foreground p-0.5 rounded" data-drag-handle contentEditable={false}>
              <GripVertical className="h-4 w-4" />
            </div>
            <input className="bg-transparent text-muted-foreground outline-none placeholder:text-muted-foreground/70 text-xs w-full min-w-0" placeholder="Filename (optional)" value={node.attrs.title || ''} onChange={(e) => updateAttributes({ title: e.target.value })} />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Select value={node.attrs.language || 'auto'} onValueChange={(language) => updateAttributes({ language })}>
              <SelectTrigger className="h-6 text-xs w-[100px] border-none bg-transparent hover:bg-muted/50 focus:ring-0 focus:ring-offset-0 px-2"><SelectValue placeholder="Language" /></SelectTrigger>
              <SelectContent><SelectItem value="auto">Auto</SelectItem>{languages.map((lang: string) => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted/50" onClick={handleCopy}>{isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <ClipboardCopy className="w-3.5 h-3.5 text-muted-foreground" />}</Button>
            <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted/50" title="Block settings"><Settings className="w-3.5 h-3.5 text-muted-foreground" /></Button></PopoverTrigger><PopoverContent className="w-auto p-2" side="bottom" align="end"><div className="space-y-2 text-sm"><div className="flex items-center space-x-2"><Checkbox id="collapsible-check" checked={node.attrs.isCollapsible} onCheckedChange={(checked) => updateAttributes({ isCollapsible: checked })} /><Label htmlFor="collapsible-check">Enable collapsible</Label></div>{node.attrs.isCollapsible && (<div className="flex items-center space-x-2 pl-4"><Checkbox id="collapsed-check" checked={node.attrs.isCollapsed} onCheckedChange={(checked) => updateAttributes({ isCollapsed: checked })} /><Label htmlFor="collapsed-check">Start collapsed</Label></div>)}</div></PopoverContent></Popover>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => editor.chain().focus().deleteNode('customCodeBlock').run()} title="Delete block"><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
        {/* Force clean tight rendering for the editor too */}
        <pre ref={preRef} className="tiptap-code-block !m-0 !p-0 !bg-transparent" style={{ maxHeight: node.attrs.maxHeight, overflowY: 'auto' }}>
          <NodeViewContent as="code" className="!whitespace-pre block" />
        </pre>
      </div>
      <div className="code-block-resizer" onMouseDown={handleResizeMouseDown} title="Drag to resize"><div className="w-full h-full bg-primary/30 group-hover/code-block:bg-primary/50 transition-colors rounded-full" /></div>
    </NodeViewWrapper>
  );
};

const CustomCodeBlock = CodeBlockLowlight.extend({
  name: 'customCodeBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  defining: true,
  draggable: true, // Keep true but rely on data-drag-handle inside
  addAttributes() {
    return {
      ...this.parent?.(),
      title: { default: null, parseHTML: el => el.getAttribute('data-title'), renderHTML: attrs => (attrs.title ? { 'data-title': attrs.title } : {}) },
      language: { default: null, parseHTML: el => el.getAttribute('data-language'), renderHTML: attrs => (attrs.language ? { 'data-language': attrs.language } : {}) },
      maxHeight: { default: '400px', parseHTML: el => el.getAttribute('data-max-height') || '400px', renderHTML: attrs => ({ 'data-max-height': attrs.maxHeight }) },
      isCollapsible: { default: false, parseHTML: el => el.getAttribute('data-is-collapsible') === 'true', renderHTML: attrs => (attrs.isCollapsible ? { 'data-is-collapsible': 'true' } : {}) },
      isCollapsed: { default: false, parseHTML: el => el.getAttribute('data-is-collapsed') === 'true', renderHTML: attrs => (attrs.isCollapsed ? { 'data-is-collapsed': 'true' } : {}) },
    };
  },
  addCommands(): Partial<RawCommands> {
    return {
      ...this.parent?.(),
      setCustomCodeBlock: (attributes) => ({ commands }) => commands.setNode(this.name, attributes),
      toggleCustomCodeBlock: (attributes) => ({ commands }) => commands.toggleNode(this.name, 'paragraph', attributes),
    }
  },
  parseHTML() { return [{ tag: 'div[data-custom-code-block]', priority: 100, preserveWhitespace: 'full', getAttrs: el => ({ language: el.getAttribute('data-language'), title: el.getAttribute('data-title'), maxHeight: el.getAttribute('data-max-height'), isCollapsible: el.getAttribute('data-is-collapsible') === 'true', isCollapsed: el.getAttribute('data-is-collapsed') === 'true' }) }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-custom-code-block': '' }), ['pre', {}, ['code', 0]]]; },
  addNodeView() { return ReactNodeViewRenderer(CodeBlockComponent); }
}).configure({ lowlight });

// --- Carousel ---

const ImageCarouselModal = ({ isOpen, onOpenChange, initialImages = [], initialAspectRatio = '16/9', initialAutoplayInterval = 5000, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, initialImages?: string[], initialAspectRatio?: string, initialAutoplayInterval?: number, onSave: (config: { images: string[], aspectRatio: string, autoplayInterval: number }) => void }) => {
  const [images, setImages] = useState(initialImages); const [aspectRatio, setAspectRatio] = useState(initialAspectRatio); const [autoplayInterval, setAutoplayInterval] = useState(initialAutoplayInterval); const [isImporting, setIsImporting] = useState(false); const [importText, setImportText] = useState(''); const [draggingImageIndex, setDraggingImageIndex] = useState<number | null>(null); const { toast } = useToast();
  const [autoplaySeconds, setAutoplaySeconds] = useState(initialAutoplayInterval === 999999999 ? 0 : initialAutoplayInterval / 1000);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null); const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  useEffect(() => { if (isOpen) { setImages(initialImages); setAspectRatio(initialAspectRatio); setAutoplaySeconds(initialAutoplayInterval === 999999999 ? 0 : initialAutoplayInterval / 1000); setAutoplayInterval(initialAutoplayInterval); setIsImporting(false); setImportText(''); } }, [isOpen, initialImages, initialAspectRatio, initialAutoplayInterval]);
  const handleSliderChange = (val: number[]) => { const sec = val[0]; setAutoplaySeconds(sec); setAutoplayInterval(sec === 0 ? 999999999 : sec * 1000); };
  const addImage = () => setImages([...images, '']); const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i)); const updateImage = (i: number, url: string) => { const n = [...images]; n[i] = url; setImages(n); };
  const handleImport = () => { setImages([...images, ...importText.split('\n').map(u => u.trim()).filter(u => u)]); setIsImporting(false); setImportText(''); };
  const handleSave = () => { onSave({ images: images.filter(u => u), aspectRatio, autoplayInterval }); onOpenChange(false); };
  const handleImageDragStart = (e: any, i: number) => setDraggingImageIndex(i); const handleImageDragOver = (e: any) => e.preventDefault(); const handleImageDrop = (e: any, target: number) => { e.preventDefault(); if (draggingImageIndex !== null && draggingImageIndex !== target) { const n = [...images]; const [d] = n.splice(draggingImageIndex, 1); n.splice(target, 0, d); setImages(n); } setDraggingImageIndex(null); };
  const handleOpenImageEditor = (i: number) => { const u = images[i]; const m = parseMediaUrl(u); if (!u || !m || m.type === 'video' || m.isGif) { toast({ title: "Editing Not Supported", variant: "destructive" }); return; } setEditingImageIndex(i); setImageToCrop(u); };
  const handleImageSave = (cropped: string) => { if (editingImageIndex !== null) updateImage(editingImageIndex, cropped); setEditingImageIndex(null); setImageToCrop(null); };
  const AspectRatioIcon = ({ ratio, className }: any) => { const viewBox = { '16:9': '0 0 16 9', '4:3': '0 0 16 12', '1:1': '0 0 16 16' }[ratio as '16:9' | '4:3' | '1:1']; return <svg viewBox={viewBox} className={cn("fill-current", className)} xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" rx="1" /></svg>; };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}><DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0"><DialogHeader className="p-6 pb-2 border-b shrink-0"><DialogTitle>Configure Image Carousel</DialogTitle></DialogHeader><div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-0 items-start"><div className="flex flex-col min-h-0 space-y-4">{isImporting ? (<div className="space-y-2 flex flex-col flex-grow"><Label htmlFor="import-urls">URLs (one per line)</Label><Textarea id="import-urls" value={importText} onChange={e => setImportText(e.target.value)} className="flex-grow" /><div className="flex justify-end gap-2 shrink-0"><Button variant="ghost" onClick={() => setIsImporting(false)}>Cancel</Button><Button onClick={handleImport}>Import</Button></div></div>) : (<><div><div className="flex justify-between items-center mb-1"><h3 className="text-sm font-medium">Media URLs</h3><Button variant="outline" size="sm" onClick={() => setIsImporting(true)}>Import</Button></div><ScrollArea className="border rounded-md p-2 h-40"><div className="space-y-2">{images.map((image, index) => (<div key={index} draggable="true" onDragStart={e => handleImageDragStart(e, index)} onDragOver={handleImageDragOver} onDrop={e => handleImageDrop(e, index)} onDragEnd={() => setDraggingImageIndex(null)} className={cn("flex items-center gap-2 p-1 rounded-md bg-muted/50 group cursor-grab", draggingImageIndex === index && "opacity-50 bg-primary/20")}><GripVertical className="h-5 w-5 text-muted-foreground shrink-0 opacity-50 group-hover:opacity-100" /><Input value={image} onChange={e => updateImage(index, e.target.value)} className="h-8" /><Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-blue-500" onClick={() => handleOpenImageEditor(index)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeImage(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>))}{images.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No media yet.</p>}</div></ScrollArea><Button variant="outline" size="sm" onClick={addImage} className="mt-2 w-full">Add URL</Button></div><Separator /><div><div className="flex justify-between items-center"><Label className="text-sm font-medium">Autoplay Speed</Label><span className="text-xs text-muted-foreground w-16 text-right">{autoplaySeconds === 0 ? 'Off' : `${autoplaySeconds.toFixed(1)}s`}</span></div><Slider min={0} max={30} step={0.5} value={[autoplaySeconds]} onValueChange={handleSliderChange} /></div><div><Label className="text-sm font-medium">Aspect Ratio</Label><div className="flex justify-start gap-2 mt-2"><Button type="button" variant={aspectRatio === '16:9' ? 'default' : 'outline'} size="icon" onClick={() => setAspectRatio('16:9')}><AspectRatioIcon ratio="16:9" className="w-5 h-5" /></Button><Button type="button" variant={aspectRatio === '4:3' ? 'default' : 'outline'} size="icon" onClick={() => setAspectRatio('4:3')}><AspectRatioIcon ratio="4:3" className="w-5 h-5" /></Button><Button type="button" variant={aspectRatio === '1:1' ? 'default' : 'outline'} size="icon" onClick={() => setAspectRatio('1:1')}><AspectRatioIcon ratio="1:1" className="w-5 h-5" /></Button></div></div></>)}</div><div className="flex flex-col sticky top-0"><h3 className="text-sm font-medium mb-2 shrink-0">Preview</h3><div className={cn("border rounded-md p-2 bg-muted/30 relative w-full", aspectRatio === '16:9' && 'aspect-[16/9]', aspectRatio === '4/3' && 'aspect-[4/3]', aspectRatio === '1/1' && 'aspect-square')}>{images.filter(u => u).length > 0 ? (<Carousel itemsToShow={1} showArrows={images.filter(u => u).length > 1} autoplay>{images.filter(u => u).map((u, i) => { const m = parseMediaUrl(u); if (!m) return null; return <CarouselItem key={i}><div className="relative w-full h-full bg-black rounded-md overflow-hidden">{m.type === 'video' ? <iframe src={m.src} title={`P ${i + 1}`} className="w-full h-full object-cover" frameBorder="0" allowFullScreen /> : <img src={m.src} alt={`P ${i+1}`} className="w-full h-full object-cover" />}</div></CarouselItem>; })}</Carousel>) : <div className="flex items-center justify-center h-full text-muted-foreground text-xs">No media</div>}</div></div></div><DialogFooter className="p-6 pt-4 border-t shrink-0"><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={handleSave}>Save</Button></DialogFooter>{imageToCrop && <ResourceImageEditor isOpen={editingImageIndex !== null} onOpenChange={o => !o && setEditingImageIndex(null)} imageSrc={imageToCrop} onSave={handleImageSave} aspectRatio={aspectRatio === '4/3' ? 4/3 : aspectRatio === '1/1' ? 1 : 16/9} />}</DialogContent></Dialog>
  );
};

const ImageCarouselComponent = (props: NodeViewProps) => {
  const { node, selected, editor, updateAttributes } = props;
  const images = node.attrs.images || []; const aspectRatio = node.attrs.aspectRatio || '16/9'; const autoplayInterval = node.attrs.autoplayInterval || 5000;
  const containerRef = useRef<HTMLDivElement>(null); const float = node.attrs['data-float']; const width = node.attrs.width; const rotation = node.attrs.rotate || 0;
  const [isModalOpen, setIsModalOpen] = useState(false); const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('top');
  useEffect(() => { if (selected && containerRef.current) { const v = editor.view.dom; const er = v.getBoundingClientRect(); const nr = containerRef.current.getBoundingClientRect(); const t = v.parentElement?.querySelector('[data-testid="rte-toolbar"]'); const th = t?.clientHeight || 45; if (nr.top - er.top < th + 40) setMenuPosition('bottom'); else setMenuPosition('top'); } }, [selected, editor.view.dom]);
  return (
    <NodeViewWrapper as="div" className="rich-text-media-node group clear-both relative my-4" style={{ width }} data-float={float} draggable="true" data-drag-handle>
      <div ref={containerRef} className={cn("relative w-full", selected && 'border-2 border-primary border-solid', aspectRatio === '16/9' && 'aspect-[16/9]', aspectRatio === '4/3' && 'aspect-[4/3]', aspectRatio === '1/1' && 'aspect-square')} style={{ transform: `rotate(${rotation}deg)` }}><div className="w-full h-full bg-muted rounded-md overflow-hidden relative">{images.length > 0 ? <Carousel itemsToShow={1} showArrows={images.length > 1} autoplay={!selected} autoplayInterval={autoplayInterval}>{images.map((u: string, i: number) => { const m = parseMediaUrl(u); if (!m) return null; return <CarouselItem key={i}><div className="relative w-full h-full bg-black">{m.type === 'video' ? <iframe src={m.src} title={`C ${i + 1}`} className="w-full h-full object-cover" frameBorder="0" allowFullScreen /> : <img src={m.src} alt={`C ${i + 1}`} className="w-full h-full object-cover" />}</div></CarouselItem>; })}</Carousel> : <div className="flex flex-col items-center justify-center h-full text-muted-foreground"><GalleryHorizontal className="w-12 h-12" /><p className="mt-2 text-sm">Empty Carousel</p></div>}{editor.isEditable && <div className="absolute inset-0 z-10 cursor-move" />}</div>{selected && (<>{handles.map((h, i) => <div key={i} className={cn("absolute w-2.5 h-2.5 bg-primary rounded-full border border-card pointer-events-auto z-20", h.pos)} style={{ cursor: getDynamicCursor(h.direction, rotation) }} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const c = containerRef.current; if (!c) return; const sx = e.clientX; const sy = e.clientY; const sw = c.offsetWidth; const sh = c.offsetHeight; const ar = aspectRatio === '4/3' ? 4/3 : aspectRatio === '1/1' ? 1 : 16/9; const arad = rotation * (Math.PI / 180); const hmm = (me: MouseEvent) => { const dx = me.clientX - sx; const dy = me.clientY - sy; const cos = Math.cos(arad); const sin = Math.sin(arad); const dxr = dx * cos + dy * sin; const dyr = -dx * sin + dy * cos; let nw = sw; let nh = sh; if (h.direction.includes('right')) nw = sw + dxr; if (h.direction.includes('left')) nw = sw - dxr; if (h.direction.includes('bottom')) nh = sh + dyr; if (h.direction.includes('top')) nh = sh - dyr; if (h.direction.includes('-')) { if (Math.abs(dxr) > Math.abs(dyr)) nh = nw / ar; else nw = nh * ar; } else { if (h.direction.includes('left') || h.direction.includes('right')) nh = nw / ar; else nw = nh * ar; } nw = Math.max(200, nw); updateAttributes({ width: `${nw}px` }); }; const hmu = () => { window.removeEventListener('mousemove', hmm); window.removeEventListener('mouseup', hmu); }; window.addEventListener('mousemove', hmm); window.addEventListener('mouseup', hmu); }} />)}<div className="absolute bottom-0 right-0 translate-x-[110%] translate-y-[110%] p-1.5 bg-card rounded-full border border-primary pointer-events-auto z-20 cursor-alias transition-transform group-hover:scale-110" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const c = containerRef.current; if (!c) return; const r = c.getBoundingClientRect(); const cx = r.left + r.width / 2; const cy = r.top + r.height / 2; const sa = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI); const ir = rotation; const hmm = (me: MouseEvent) => { const ca = Math.atan2(me.clientY - cy, me.clientX - cx) * (180 / Math.PI); updateAttributes({ rotate: (ir + (ca - sa)) % 360 }); }; const hmu = () => { window.removeEventListener('mousemove', hmm); window.removeEventListener('mouseup', hmu); }; window.addEventListener('mousemove', hmm); window.addEventListener('mouseup', hmu); }} title="Rotate"><RotateCw className="w-4 h-4 text-primary" /></div></>)}</div>{selected && <div className={cn("absolute left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-card p-1 rounded-md shadow-lg border border-border pointer-events-auto", menuPosition === 'top' ? "top-0 -translate-y-[calc(100%+12px)]" : "bottom-0 translate-y-[calc(100%+12px)]")}><Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsModalOpen(true)} title="Edit"><ImageIcon className="h-4 w-4" /></Button><div className="w-px h-5 bg-border mx-1 self-center" /><Button type="button" size="icon" variant={float === 'left' ? 'default' : 'ghost'} className="h-7 w-7" onClick={() => updateAttributes({ 'data-float': 'left' })}><AlignLeft className="w-4 h-4" /></Button><Button type="button" size="icon" variant={!float || float === 'center' ? 'default' : 'ghost'} className="h-7 w-7" onClick={() => updateAttributes({ 'data-float': 'center' })}><AlignCenter className="w-4 h-4" /></Button><Button type="button" size="icon" variant={float === 'right' ? 'default' : 'ghost'} className="h-7 w-7" onClick={() => updateAttributes({ 'data-float': 'right' })}><AlignRight className="w-4 h-4" /></Button><div className="w-px h-5 bg-border mx-1 self-center" /><Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateAttributes({ rotate: (rotation + 90) % 360 })}><RotateCw className="w-4 h-4" /></Button></div>}{createPortal(<ImageCarouselModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} initialImages={images} initialAspectRatio={aspectRatio} initialAutoplayInterval={autoplayInterval} onSave={handleSaveCarousel} />, document.body)}</NodeViewWrapper>
  );
};

const ImageCarouselNode = Node.create({ name: 'imageCarousel', group: 'block', atom: true, draggable: true, addAttributes() { return { images: { default: [], parseHTML: e => JSON.parse(e.getAttribute('data-images') || '[]'), renderHTML: a => ({ 'data-images': JSON.stringify(a.images) }) }, width: { default: '100%', renderHTML: a => (a.width ? { style: `width: ${a.width}` } : {}), parseHTML: e => e.style.width || null }, 'data-float': { default: 'center', renderHTML: a => ({ 'data-float': a['data-float'] }), parseHTML: e => e.getAttribute('data-float') }, rotate: { default: 0, renderHTML: a => (a.rotate ? { style: `transform: rotate(${a.rotate}deg)` } : {}), parseHTML: e => { const t = e.style.transform; if (t && t.includes('rotate')) { const m = t.match(/rotate\(([^deg)]+)deg\)/); return m ? parseFloat(m[1]) : 0; } return 0; } }, autoplayInterval: { default: 5000, parseHTML: e => parseInt(e.getAttribute('data-autoplay-interval') || '5000', 10), renderHTML: a => ({ 'data-autoplay-interval': a.autoplayInterval }) }, aspectRatio: { default: '16/9', parseHTML: e => e.getAttribute('data-aspect-ratio') || '16/9', renderHTML: a => ({ 'data-aspect-ratio': a.aspectRatio }) } }; }, parseHTML() { return [{ tag: 'div[data-image-carousel]' }]; }, renderHTML({ HTMLAttributes }) { const s = []; if (HTMLAttributes.width) s.push(`width: ${HTMLAttributes.width}`); if (HTMLAttributes.rotate) s.push(`transform: rotate(${HTMLAttributes.rotate}deg)`); const f = { ...HTMLAttributes }; if (s.length) f.style = s.join('; '); delete f.width; delete f.rotate; return ['div', { ...f, 'data-image-carousel': '' }]; }, addCommands() { return { setImageCarousel: (o: any) => ({ commands }) => commands.insertContent({ type: this.name, attrs: o }) }; }, addNodeView() { return ReactNodeViewRenderer(ImageCarouselComponent); } });

const CustomImage = TiptapImage.extend({ draggable: true, addAttributes() { return { ...this.parent?.(), class: { default: 'rich-text-media-node' }, width: { default: '100%', renderHTML: a => ({ style: `width: ${a.width};` }), parseHTML: e => e.style.width || null }, height: { default: null, renderHTML: a => ({ style: `height: ${a.height};` }), parseHTML: e => e.style.height || null }, 'data-float': { default: 'center', renderHTML: a => ({ 'data-float': a['data-float'] }), parseHTML: e => e.getAttribute('data-float') }, rotate: { default: 0, renderHTML: a => ({ style: `transform: rotate(${a.rotate}deg)` }), parseHTML: e => { const t = e.style.transform; if (t && t.includes('rotate')) { const m = t.match(/rotate\(([^deg)]+)deg\)/); return m ? parseFloat(m[1]) : 0; } return 0; } }, href: { default: null }, target: { default: null } }; }, parseHTML() { return [{ tag: 'a[href]:not([href^="javascript:"]) > img[src]:not([src^="data:"])', getAttrs: d => { const l = d.parentElement as any; const i = d as any; return { src: i.getAttribute('src'), alt: i.getAttribute('alt'), title: i.getAttribute('title'), href: l.getAttribute('href'), target: l.getAttribute('target') }; } }, { tag: 'img[src]:not([src^="data:"])', getAttrs: d => { const i = d as any; if (i.closest('a')) return false; return { src: i.getAttribute('src'), alt: i.getAttribute('alt'), title: i.getAttribute('title'), href: null, target: null }; } }]; }, renderHTML({ HTMLAttributes }) { const { href, target, ...img } = HTMLAttributes; const it: any = ['img', img]; if (href) return ['a', { href, target, rel: 'noopener noreferrer nofollow' }, it]; return it; }, addNodeView() { return ReactNodeViewRenderer(MediaResizeComponent); } });

const CustomYoutube = Youtube.extend({ draggable: true, addAttributes() { return { ...this.parent?.(), class: { default: 'rich-text-media-node' }, width: { default: '640px', renderHTML: a => ({ style: `width: ${a.width};` }), parseHTML: e => e.style.width || '640px' }, height: { default: '480px', renderHTML: a => ({ style: `height: ${a.height};` }), parseHTML: e => e.style.height || '480px' }, 'data-float': { default: 'center', renderHTML: a => ({ 'data-float': a['data-float'] }), parseHTML: e => e.getAttribute('data-float') }, rotate: { default: 0, renderHTML: a => ({ style: `transform: rotate(${a.rotate}deg)` }), parseHTML: e => { const t = e.style.transform; if (t && t.includes('rotate')) { const m = t.match(/rotate\(([^deg)]+)deg\)/); return m ? parseFloat(m[1]) : 0; } return 0; } } }; }, addNodeView() { return ReactNodeViewRenderer(MediaResizeComponent); } });

const CustomModelViewer = Node.create({ name: 'modelViewer', group: 'block', atom: true, draggable: true, addAttributes() { return { src: { default: null }, width: { default: '640px', renderHTML: a => ({ style: `width: ${a.width};` }), parseHTML: e => e.style.width || null }, height: { default: '480px', renderHTML: a => ({ style: `height: ${a.height};` }), parseHTML: e => e.style.height || null }, 'data-float': { default: 'center', renderHTML: a => ({ 'data-float': a['data-float'] }), parseHTML: e => e.getAttribute('data-float') }, rotate: { default: 0, renderHTML: a => ({ style: `transform: rotate(${a.rotate}deg)` }), parseHTML: e => { const t = e.style.transform; if (t && t.includes('rotate')) { const m = t.match(/rotate\(([^deg)]+)deg\)/); return m ? parseFloat(m[1]) : 0; } return 0; } }, class: { default: 'rich-text-media-node' } }; }, parseHTML() { return [{ tag: 'model-viewer[src]' }]; }, renderHTML({ HTMLAttributes }) { return ['model-viewer', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]; }, addCommands() { return { setModelViewer: (o: any) => ({ commands }) => commands.insertContent({ type: this.name, attrs: o }) }; }, addNodeView() { return ReactNodeViewRenderer(MediaResizeComponent); } });

const CustomIframe = Node.create({ name: 'iframe', group: 'block', atom: true, draggable: true, addAttributes() { return { src: { default: null }, frameborder: { default: 0 }, allowfullscreen: { default: true }, width: { default: '640px', renderHTML: a => ({ style: `width: ${a.width};` }), parseHTML: e => e.style.width || null }, height: { default: '480px', renderHTML: a => ({ style: `height: ${a.height};` }), parseHTML: e => e.style.height || null }, 'data-float': { default: 'center', renderHTML: a => ({ 'data-float': a['data-float'] }), parseHTML: e => e.getAttribute('data-float') }, rotate: { default: 0, renderHTML: a => ({ style: `transform: rotate(${a.rotate}deg)` }), parseHTML: e => { const t = e.style.transform; if (t && t.includes('rotate')) { const m = t.match(/rotate\(([^deg)]+)deg\)/); return m ? parseFloat(m[1]) : 0; } return 0; } }, class: { default: 'rich-text-media-node' } }; }, parseHTML() { return [{ tag: 'iframe[src]:not([data-youtube-video])' }]; }, renderHTML({ HTMLAttributes }) { return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]; }, addCommands() { return { setIframe: (o: any) => ({ commands }) => commands.insertContent({ type: this.name, attrs: o }) }; }, addNodeView() { return ReactNodeViewRenderer(MediaResizeComponent); } });

// --- UI Components ---

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [debouncedUrl, setDebouncedUrl] = useState('');
  useEffect(() => { const h = setTimeout(() => setDebouncedUrl(url), 500); return () => clearTimeout(h); }, [url]);
  if (!editor) return null;
  const getYoutubeEmbedUrl = (u: string) => { const s = u.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/); if (s) return `https://www.youtube-nocookie.com/embed/${s[1]}`; const sh = u.match(/(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/); if (sh) return `https://www.youtube-nocookie.com/embed/${sh[1]}`; const em = u.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/); if (em) return `https://www.youtube-nocookie.com/embed/${em[1]}`; return null; };
  const getSketchfabEmbedUrl = (u: string) => { const p = u.match(/sketchfab\.com\/3d-models\/(?:[a-z0-9\-_]+-)?([a-fA-F0-9]{32})/); if (p) return `https://sketchfab.com/models/${p[1]}/embed?autospin=1&autostart=1&ui_theme=dark`; return u.includes('sketchfab.com/models/') && u.includes('/embed') ? u : null; };
  const handleMediaModalOpen = (t: any) => { setUrl(''); setDebouncedUrl(''); if (t === 'image') setIsImageModalOpen(true); if (t === 'video') setIsVideoModalOpen(true); if (t === 'model') setIsModelModalOpen(true); if (t === 'carousel') setIsCarouselModalOpen(true); };
  const isLinkActive = editor.isActive('link') || (editor.isActive('image') && !!editor.getAttributes('image').href);
  const openLinkModal = () => { const i = editor.isActive('image'); const p = i ? editor.getAttributes('image').href : editor.getAttributes('link').href; setUrl(p || ''); setDebouncedUrl(p || ''); setIsLinkModalOpen(true); };
  const setLink = () => { if (!url) { if (editor.isActive('image')) editor.chain().focus().updateAttributes('image', { href: null, target: null }).run(); else editor.chain().focus().extendMarkRange('link').unsetLink().run(); } else { if (editor.isActive('image')) editor.chain().focus().updateAttributes('image', { href: url, target: '_blank' }).run(); else editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run(); } setIsLinkModalOpen(false); setUrl(''); };
  const addImage = () => { if (url) editor.chain().focus().setImage({ src: url }).run(); setIsImageModalOpen(false); };
  const addYoutubeVideo = () => { if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run(); setIsVideoModalOpen(false); };
  const addModelViewer = () => { if (url) { const sf = getSketchfabEmbedUrl(url); if (sf) editor.chain().focus().setIframe({ src: sf }).run(); else if (url.match(/\.(glb|gltf)$/i)) editor.chain().focus().setModelViewer({ src: url }).run(); else editor.chain().focus().setIframe({ src: url }).run(); } setIsModelModalOpen(false); };
  return (
    <><div data-testid="rte-toolbar" className="flex flex-wrap items-center gap-1 p-1 border-b"><Select value={editor.getAttributes('textStyle').fontFamily || '_default_font_'} onValueChange={v => v === '_default_font_' ? editor.chain().focus().unsetFontFamily().run() : editor.chain().focus().setFontFamily(v).run()}><SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Font" /></SelectTrigger><SelectContent>{[{ label: "Default", value: "_default_font_" }, { label: "Sans-Serif", value: "var(--font-geist-sans), sans-serif" }, { label: "Serif", value: "serif" }, { label: "Monospace", value: "var(--font-geist-mono), monospace" }].map(f => <SelectItem key={f.label} value={f.value} className="text-xs" style={{ fontFamily: f.value === '_default_font_' ? 'inherit' : f.value }}>{f.label}</SelectItem>)}</SelectContent></Select><Select value={editor.getAttributes('textStyle').fontSize || '_default_size_'} onValueChange={v => v === '_default_size_' ? editor.chain().focus().unsetFontSize().run() : editor.chain().focus().setFontSize(v).run()}><SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="Size" /></SelectTrigger><SelectContent>{[{ label: "Small", value: "12px" }, { label: "Normal", value: "_default_size_" }, { label: "Large", value: "18px" }, { label: "Huge", value: "24px" }].map(s => <SelectItem key={size.label} value={s.value} className="text-xs">{s.label}</SelectItem>)}</SelectContent></Select><Separator orientation="vertical" className="h-6" /><Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBold().run()} className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted text-primary")}><Bold className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted text-primary")}><Italic className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()} className={cn("h-8 w-8", editor.isActive('underline') && "bg-muted text-primary")}><UnderlineIcon className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleStrike().run()} className={cn("h-8 w-8", editor.isActive('strike') && "bg-muted text-primary")}><Strikethrough className="h-4 w-4" /></Button><GradientPicker value={editor.getAttributes('textStyle').textGradient || editor.getAttributes('textStyle').color || '#ffffff'} onChange={v => { const isG = v.includes('gradient'); const { fontFamily, fontSize } = editor.getAttributes('textStyle'); const attrs: any = { fontFamily, fontSize }; if (isG) { attrs.color = null; attrs.textGradient = v; } else { attrs.textGradient = null; attrs.color = v; } editor.chain().focus().setMark('textStyle', attrs).run(); }} /><Button type="button" variant="ghost" size="icon" onClick={openLinkModal} className={cn("h-8 w-8", isLinkActive && "bg-muted text-primary")}><LinkIcon className="h-4 w-4" /></Button><Separator orientation="vertical" className="h-6" /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><AlignJustify className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4 mr-2" /> Left</DropdownMenuItem><DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4 mr-2" /> Center</DropdownMenuItem><DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4 mr-2" /> Right</DropdownMenuItem></DropdownMenuContent></DropdownMenu><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4 mr-2" /> Bullet List</DropdownMenuItem><DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4 mr-2" /> Numbered List</DropdownMenuItem></DropdownMenuContent></DropdownMenu><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><ImagePlus className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => editor.chain().focus().toggleCustomCodeBlock().run()}><CodeIcon className="h-4 w-4 mr-2" /> Code Block</DropdownMenuItem><DropdownMenuItem onClick={() => handleMediaModalOpen('image')}><ImageIcon className="h-4 w-4 mr-2" /> Image</DropdownMenuItem><DropdownMenuItem onClick={() => handleMediaModalOpen('video')}><Video className="h-4 w-4 mr-2" /> YouTube</DropdownMenuItem><DropdownMenuItem onClick={() => handleMediaModalOpen('model')}><Box className="h-4 w-4 mr-2" /> 3D Model</DropdownMenuItem><DropdownMenuItem onClick={() => handleMediaModalOpen('carousel')}><GalleryHorizontal className="h-4 w-4 mr-2" /> Carousel</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>{createPortal(<><Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}><DialogContent><DialogHeader><DialogTitle>Set Link</DialogTitle></DialogHeader><div className="space-y-2"><Label>URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." /></div><DialogFooter><Button variant="ghost" onClick={() => { setUrl(''); setLink(); }}>Clear</Button><Button onClick={setLink}>Set</Button></DialogFooter></DialogContent></Dialog><Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}><DialogContent><DialogHeader><DialogTitle>Embed Image</DialogTitle></DialogHeader><div className="space-y-2"><Label>URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} />{debouncedUrl && <img src={debouncedUrl} alt="P" className="mt-2 rounded-md max-h-48 w-full object-contain border" />}</div><DialogFooter><Button onClick={addImage}>Add</Button></DialogFooter></DialogContent></Dialog><Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}><DialogContent><DialogHeader><DialogTitle>Embed YouTube</DialogTitle></DialogHeader><div className="space-y-2"><Label>URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} />{debouncedUrl && getYoutubeEmbedUrl(debouncedUrl) && <iframe className="w-full aspect-video mt-2 rounded-md border" src={getYoutubeEmbedUrl(debouncedUrl)!} />}</div><DialogFooter><Button onClick={addYoutubeVideo}>Add</Button></DialogFooter></DialogContent></Dialog><Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}><DialogContent><DialogHeader><DialogTitle>Embed 3D/Iframe</DialogTitle></DialogHeader><div className="space-y-2"><Label>URL (Sketchfab/GLB/Any)</Label><Input value={url} onChange={e => setUrl(e.target.value)} /></div><DialogFooter><Button onClick={addModelViewer}>Add</Button></DialogFooter></DialogContent></Dialog><ImageCarouselModal isOpen={isCarouselModalOpen} onOpenChange={setIsCarouselModalOpen} onSave={handleSaveCarousel} /></>, document.body)}</>
  );
};

interface RichTextEditorProps {
  initialContent?: string;
  readonly?: boolean;
  onChange: (html: string) => void;
}

export const RichTextEditor = ({ initialContent, onChange, readonly }: RichTextEditorProps) => {
  const { theme } = useCodeHighlightTheme();
  const editorId = useMemo(() => `rte-${Math.random().toString(36).slice(2, 11)}`, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false }),
      CustomCodeBlock, TextStyle, FontFamily, FontSize.configure({ types: ['textStyle'] }), TextGradient,
      TiptapLink.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-primary hover:text-accent transition-colors cursor-pointer underline' } }),
      CustomImage.configure({ inline: false, allowBase64: true }),
      CustomYoutube.configure({ inline: false, controls: false, nocookie: true }),
      CustomModelViewer, CustomIframe, ImageCarouselNode,
      TextAlign.configure({ types: ['paragraph', 'image', 'youtube', 'modelViewer', 'iframe', 'imageCarousel', 'customCodeBlock'] }),
      Color, Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: cn('prose dark:prose-invert max-w-none prose-sm sm:prose-base focus:outline-none') } },
  });

  return (
    <div id={editorId} className="w-full rounded-md border border-input bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100, zIndex: 30 }} className="bg-card p-1 rounded-lg shadow-lg border border-border flex items-center gap-0.5" shouldShow={({ editor, from, to }) => {
          if (!editor.isFocused || from === to) return false;
          let isMedia = false;
          editor.state.doc.nodesBetween(from, to, node => { if (['image', 'youtube', 'modelViewer', 'iframe', 'imageCarousel', 'customCodeBlock'].includes(node.type.name)) isMedia = true; });
          return !isMedia;
        }}>
          <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBold().run()} className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted text-primary")}><Bold className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted text-primary")}><Italic className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()} className={cn("h-8 w-8", editor.isActive('underline') && "bg-muted text-primary")}><UnderlineIcon className="h-4 w-4" /></Button>
          <Separator orientation="vertical" className="h-6" />
          <GradientPicker value={editor.getAttributes('textStyle').textGradient || editor.getAttributes('textStyle').color || '#ffffff'} onChange={v => { const isG = v.includes('gradient'); const { fontFamily, fontSize } = editor.getAttributes('textStyle'); const attrs: any = { fontFamily, fontSize }; if (isG) { attrs.color = null; attrs.textGradient = v; } else { attrs.textGradient = null; attrs.color = v; } editor.chain().focus().setMark('textStyle', attrs).run(); }} />
        </BubbleMenu>
      )}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm z-10"><Toolbar editor={editor} /></div>
      <div className="min-h-[250px] max-h-[400px] overflow-y-auto overflow-x-hidden px-3 py-2 custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

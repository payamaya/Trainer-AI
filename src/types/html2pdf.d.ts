// c:/Users/pauly/trainerai/src/types/html2pdf.d.ts

declare module 'html2pdf.js' {
  // No 'export' keyword here. These interfaces become available when html2pdf.js is imported.
  export interface HTML2PDFOptions {
    margin?: number | [number, number, number, number] // Top, Left, Bottom, Right
    filename?: string
    image?: {
      type?: 'jpeg' | 'png' | 'webp'
      quality?: number // 0 to 1
    }
    html2canvas?: {
      scale?: number
      dpi?: number
      letterRendering?: boolean
      useCORS?: boolean
      allowTaint?: boolean
      backgroundColor?: string | null
      width?: number
      height?: number
      x?: number
      y?: number
      windowWidth?: number
      windowHeight?: number
      scrollY?: number
      ignoreElements?: (element: HTMLElement) => boolean
      foreignObjectRendering?: boolean
      logging?: boolean
      removeContainer?: boolean
      async?: boolean
      proxy?: string
    }
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in'
      format?: string | [number, number] // e.g., 'a4', 'letter', [width, height]
      orientation?: 'portrait' | 'landscape'
      hotfixes?: string[]
      putOnlyUsedFonts?: boolean
      compress?: boolean
      precision?: number
      floatPrecision?: number
    }
    pagebreak?: {
      mode?: 'css' | 'avoid-all' | 'legacy'
      before?: string | string[] // CSS selector(s)
      after?: string | string[] // CSS selector(s)
      avoid?: string | string[] // CSS selector(s)
    }
  }

  interface HTML2PDF {
    from: (element: HTMLElement | string) => HTML2PDF
    set: (options: HTML2PDFOptions) => HTML2PDF
    save: () => void
    outputPdf: (type?: string, options?: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
    // Add other methods if you use them, e.g., toPdf, toContainer, etc.
  }

  function html2pdf(): HTML2PDF

  export default html2pdf // This remains for the default import of the module itself
}

declare module 'html2pdf.js' {
  export interface HTML2PDFOptions {
    margin?: number | [number, number, number, number]
    filename?: string
    image?: {
      type?: 'jpeg' | 'png' | 'webp'
      quality?: number
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
      format?: string | [number, number]
      orientation?: 'portrait' | 'landscape'
      hotfixes?: string[]
      putOnlyUsedFonts?: boolean
      compress?: boolean
      precision?: number
      floatPrecision?: number
    }
    pagebreak?: {
      mode?: 'css' | 'avoid-all' | 'legacy'
      before?: string | string[]
      after?: string | string[]
      avoid?: string | string[]
    }
  }

  interface HTML2PDF {
    from: (element: HTMLElement | string) => HTML2PDF
    set: (options: HTML2PDFOptions) => HTML2PDF
    save: () => void
    outputPdf: (type?: string, options?: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  function html2pdf(): HTML2PDF

  export default html2pdf
}

const fs = require('fs');
let content = fs.readFileSync('src/components/ResultPreview.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  '  MapPin\n} from "lucide-react";',
  '  MapPin,\n  Loader2\n} from "lucide-react";\nimport html2canvas from "html2canvas";\nimport jsPDF from "jspdf";'
);

// 2. Add state and handler
content = content.replace(
  '  const [copied, setCopied] = React.useState(false);\n\n  const [isLogoSpinning, setIsLogoSpinning] = React.useState(false);',
  '  const [copied, setCopied] = React.useState(false);\n  const [isDownloadingPDF, setIsDownloadingPDF] = React.useState(false);\n\n  const [isLogoSpinning, setIsLogoSpinning] = React.useState(false);\n\n  const handleDownloadPDF = async () => {\n    if (isDownloadingPDF) return;\n    setIsDownloadingPDF(true);\n    try {\n      const element = document.getElementById("top");\n      if (!element) return;\n      const canvas = await html2canvas(element, {\n        scale: 2,\n        useCORS: true,\n        backgroundColor: "#0a0518",\n        windowWidth: 1200\n      });\n      const imgData = canvas.toDataURL("image/jpeg", 0.95);\n      const pdf = new jsPDF("p", "mm", "a4");\n      const pdfWidth = pdf.internal.pageSize.getWidth();\n      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;\n      let heightLeft = pdfHeight;\n      let position = 0;\n      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);\n      heightLeft -= pdf.internal.pageSize.getHeight();\n      while (heightLeft >= 0) {\n        position = heightLeft - pdfHeight;\n        pdf.addPage();\n        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);\n        heightLeft -= pdf.internal.pageSize.getHeight();\n      }\n      const filename = reading ? `${reading.name.replace(/\\s+/g, "_")}_Cosmic_Blueprint.pdf` : "NumGuru_Report.pdf";\n      pdf.save(filename);\n    } catch (error) {\n      console.error("PDF generation failed:", error);\n    } finally {\n      setIsDownloadingPDF(false);\n    }\n  };'
);

// 3. Desktop button
const desktopButton = `                  </span>
                </button>

                {isUnlocked && (
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloadingPDF}
                    className="hidden lg:flex relative group px-3 xl:px-5 py-2 rounded-full overflow-hidden transition-all duration-500 active:scale-95 shadow-[0_0_25px_rgba(16,185,129,0.2)] ml-2"
                  >
                    <div className="absolute inset-0 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20" />
                    <div className="absolute inset-0 border-[2px] border-emerald-500/30 rounded-full group-hover:border-emerald-500/60 transition-colors pointer-events-none z-20" />
                    <span className="relative z-10 text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5 px-0.5 transition-colors">
                      {isDownloadingPDF ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      <span className="tracking-[0.1em] font-black text-[9px] xl:text-[10px] uppercase whitespace-nowrap">
                        {isDownloadingPDF ? "Generating..." : "Download PDF"}
                      </span>
                    </span>
                  </button>
                )}`;
content = content.replace(
  '                  </span>\n                </button>',
  desktopButton
);

// 4. Mobile button
const mobileButton = `                Share Profile
              </button>

              {isUnlocked && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDownloadPDF();
                  }}
                  disabled={isDownloadingPDF}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] border border-emerald-400/30"
                >
                  {isDownloadingPDF ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  {isDownloadingPDF ? "Generating..." : "Download PDF"}
                </button>
              )}`;
content = content.replace(
  '                Share Profile\n              </button>',
  mobileButton
);

fs.writeFileSync('src/components/ResultPreview.tsx', content);
console.log('Update complete');

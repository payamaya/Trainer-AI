export const useResponseAction = (
  response: string,
  setInput: (input: string) => void,
  onDownloadClick: () => void
) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(response)
  }
  const reuseAsInput = () => {
    setInput(response)
  }
  const downloadAsPDF = () => {
    onDownloadClick()
  }
  return { copyToClipboard, reuseAsInput, downloadAsPDF }
}

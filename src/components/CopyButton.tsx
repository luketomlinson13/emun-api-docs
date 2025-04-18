/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Tooltip, IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface Props {
    textToCopy: any | (() => any); 
}

export default function CopyButton(props: Props) {
  const [tooltipText, setTooltipText] = useState('Copy')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(typeof props.textToCopy === "function" ? props.textToCopy() : props.textToCopy)
    setTooltipText('Copied')
    setTimeout(() => {
      setTooltipText('Copy')
    }, 1500)
  }

  return (
    <Tooltip 
        title={tooltipText} 
        arrow   
        placement='top'
    >
      <IconButton onClick={handleCopy}>
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>
  )
}

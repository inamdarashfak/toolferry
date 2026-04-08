'use client'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  currencyOptions,
  detectDefaultCurrency,
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
} from '../../lib/calculator'

type InvoiceParty = {
  name: string
  businessName: string
  address: string
  phone: string
  email: string
  gstin: string
  state: string
}

type InvoiceMeta = {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  placeOfSupply: string
  paymentTerms: string
  notes: string
}

type InvoiceLineItem = {
  id: string
  description: string
  quantity: string
  unitPrice: string
  gstRate: string
}

type InvoiceAdjustments = {
  discount: string
  shipping: string
  amountPaid: string
}

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

let lineItemCounter = 0

function createLineItem(overrides?: Partial<InvoiceLineItem>): InvoiceLineItem {
  lineItemCounter += 1

  return {
    id: `invoice-item-${lineItemCounter}`,
    description: '',
    quantity: '1',
    unitPrice: '0',
    gstRate: '18',
    ...overrides,
  }
}

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

function getFutureInputValue(daysAhead: number) {
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + daysAhead)
  return nextDate.toISOString().slice(0, 10)
}

function formatDateLabel(value: string, locale: string) {
  if (!value) {
    return 'Not set'
  }

  const nextValue = new Date(`${value}T00:00:00`)

  if (Number.isNaN(nextValue.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(nextValue)
}

function formatAddressBlock(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('<br />')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPrintMarkup({
  businessTitle,
  businessSubtitle,
  paymentStatus,
  invoiceDetails,
  sellerBlock,
  clientBlock,
  lineRows,
  totalsRows,
  paymentTerms,
  notes,
  currencySymbol,
  numberLocale,
}: {
  businessTitle: string
  businessSubtitle: string
  paymentStatus: string
  invoiceDetails: Array<{ label: string; value: string }>
  sellerBlock: { title: string; subtitle: string }
  clientBlock: { title: string; subtitle: string }
  lineRows: Array<{
    description: string
    quantity: number
    unitPrice: number
    gstRate: number
    taxableValue: number
    gstValue: number
    lineTotal: number
  }>
  totalsRows: Array<{ label: string; value: number; emphasis?: boolean }>
  paymentTerms: string
  notes: string
  currencySymbol: string
  numberLocale: string
}) {
  const rowsMarkup = lineRows
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${formatNumber(item.quantity, numberLocale, { maximumFractionDigits: 2 })}</td>
          <td>${currencySymbol} ${formatNumber(item.unitPrice, numberLocale)}</td>
          <td>${item.gstRate}%</td>
          <td>${currencySymbol} ${formatNumber(item.taxableValue, numberLocale)}</td>
          <td>${currencySymbol} ${formatNumber(item.gstValue, numberLocale)}</td>
          <td>${currencySymbol} ${formatNumber(item.lineTotal, numberLocale)}</td>
        </tr>
      `
    )
    .join('')

  const invoiceDetailsMarkup = invoiceDetails
    .map(
      (item) => `
        <div class="meta-item">
          <span class="label">${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </div>
      `
    )
    .join('')

  const totalsMarkup = totalsRows
    .map(
      (row) => `
        <tr>
          <td>${row.emphasis ? `<strong>${escapeHtml(row.label)}</strong>` : escapeHtml(row.label)}</td>
          <td>${
            row.emphasis
              ? `<strong>${currencySymbol} ${formatNumber(row.value, numberLocale)}</strong>`
              : `${currencySymbol} ${formatNumber(row.value, numberLocale)}`
          }</td>
        </tr>
      `
    )
    .join('')

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${escapeHtml(invoiceDetails[0]?.value || 'invoice')}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0b1f33; }
          .invoice { width: 100%; }
          .top { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #d8e1e8; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 14px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #5f6b7a; }
          .heading { font-size: 26px; font-weight: 700; margin: 4px 0 6px; }
          .sub { font-size: 12px; line-height: 1.55; }
          .meta-grid { display: grid; grid-template-columns: 1fr; gap: 6px; }
          .meta-item { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 5px; border-bottom: 1px solid #edf1f4; }
          .meta-item strong { display: block; margin-top: 0; font-size: 12px; text-align: right; }
          .section { margin-top: 12px; padding-top: 0; border-top: 0; }
          .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #5f6b7a; margin-bottom: 6px; }
          .party-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          th, td { border-bottom: 1px solid #d8e1e8; padding: 7px 6px; font-size: 11.5px; text-align: left; vertical-align: top; }
          th { background: #f7fafb; }
          .totals { width: 100%; margin-top: 6px; }
          .totals table td { font-size: 12.5px; }
          .totals table td:last-child { text-align: right; }
          .totals table tr:last-child td { border-bottom: 0; }
          .status { display: inline-block; padding: 4px 8px; border: 1px solid #d8e1e8; font-size: 11px; margin-top: 6px; }
          .notes { font-size: 12px; line-height: 1.6; }
          .bill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
          .footer-note { margin-top: 18px; padding-top: 10px; border-top: 1px solid #d8e1e8; font-size: 11px; color: #5f6b7a; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="top">
            <div>
              <div class="label">Tax Invoice</div>
              <h1 class="heading">${escapeHtml(businessTitle)}</h1>
              <div class="sub">${formatAddressBlock(escapeHtml(businessSubtitle))}</div>
            </div>
            <div>
              <div class="meta-grid">${invoiceDetailsMarkup}</div>
              <div class="status">${escapeHtml(paymentStatus)}</div>
            </div>
          </div>

          <div class="section">
            <div class="bill-grid">
              <div>
                <div class="section-title">Bill From</div>
                <div class="party-name">${escapeHtml(sellerBlock.title)}</div>
                <div class="sub">${formatAddressBlock(escapeHtml(sellerBlock.subtitle))}</div>
              </div>
              <div>
                <div class="section-title">Bill To</div>
                <div class="party-name">${escapeHtml(clientBlock.title)}</div>
                <div class="sub">${formatAddressBlock(escapeHtml(clientBlock.subtitle))}</div>
              </div>
            </div>
          </div>

          <div class="section">
          <div class="section-title">Line Items</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>GST</th>
                <th>Taxable</th>
                <th>Tax</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>${rowsMarkup}</tbody>
          </table>
          </div>

          <div class="section totals">
            <div class="section-title">Totals</div>
            <table>
              <tbody>${totalsMarkup}</tbody>
            </table>
          </div>

          <div class="section notes">
            <div class="section-title">Payment Terms</div>
            <div><strong>Payment Terms:</strong> ${escapeHtml(paymentTerms)}</div>
            <div class="section-title" style="margin-top:14px;">Notes</div>
            <div style="margin-top: 8px;"><strong>Notes:</strong> ${escapeHtml(notes)}</div>
          </div>

          <div class="footer-note">
            This is a computer generated invoice. No signature is required.
          </div>
        </div>
      </body>
    </html>
  `
}

const DEFAULT_SELLER: InvoiceParty = {
  name: 'Riya Sharma',
  businessName: 'Studio South Creative',
  address: '24 Lake View Road\nBengaluru, Karnataka 560034',
  phone: '+91 98765 43210',
  email: 'hello@studiosouth.example',
  gstin: '29ABCDE1234F1Z5',
  state: 'Karnataka',
}

const DEFAULT_CLIENT: InvoiceParty = {
  name: 'Vikram Mehta',
  businessName: 'Northline Retail Pvt Ltd',
  address: '18 Market Street\nMumbai, Maharashtra 400001',
  phone: '+91 91234 56789',
  email: 'accounts@northline.example',
  gstin: '27ABCDE1234F1Z1',
  state: 'Maharashtra',
}

const DEFAULT_META: InvoiceMeta = {
  invoiceNumber: 'INV-2026-041',
  invoiceDate: getTodayInputValue(),
  dueDate: getFutureInputValue(14),
  placeOfSupply: 'Maharashtra',
  paymentTerms:
    '50% advance received. Balance due within 14 days of invoice date.',
  notes: 'Please include the invoice number in the payment reference.',
}

const DEFAULT_ADJUSTMENTS: InvoiceAdjustments = {
  discount: '1500',
  shipping: '800',
  amountPaid: '12000',
}

const DEFAULT_LINE_ITEMS = [
  createLineItem({
    description: 'Website homepage redesign',
    quantity: '1',
    unitPrice: '18000',
    gstRate: '18',
  }),
  createLineItem({
    description: 'Product launch banner set',
    quantity: '3',
    unitPrice: '3500',
    gstRate: '18',
  }),
]

function InvoiceGenerator() {
  const [seller, setSeller] = useState(DEFAULT_SELLER)
  const [client, setClient] = useState(DEFAULT_CLIENT)
  const [meta, setMeta] = useState(DEFAULT_META)
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS)
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code)
  const [items, setItems] = useState<InvoiceLineItem[]>(DEFAULT_LINE_ITEMS)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale

  const computedInvoice = useMemo(() => {
    const validItems = items
      .map((item) => {
        const quantity = Number(item.quantity) || 0
        const unitPrice = Number(item.unitPrice) || 0
        const gstRate = Number(item.gstRate) || 0
        const taxableValue = quantity * unitPrice

        return {
          ...item,
          quantity,
          unitPrice,
          gstRate,
          taxableValue,
        }
      })
      .filter((item) => item.description.trim() || item.taxableValue > 0)

    const subtotal = validItems.reduce(
      (sum, item) => sum + item.taxableValue,
      0
    )
    const rawDiscount = Number(adjustments.discount) || 0
    const discount = Math.min(Math.max(rawDiscount, 0), subtotal)
    const shipping = Math.max(Number(adjustments.shipping) || 0, 0)
    const amountPaid = Math.max(Number(adjustments.amountPaid) || 0, 0)
    const sameStateSupply =
      seller.state.trim() &&
      meta.placeOfSupply.trim() &&
      seller.state.trim().toLowerCase() ===
        meta.placeOfSupply.trim().toLowerCase()

    const lineRows = validItems.map((item) => {
      const discountShare =
        subtotal > 0 ? (discount * item.taxableValue) / subtotal : 0
      const taxableAfterDiscount = Math.max(
        item.taxableValue - discountShare,
        0
      )
      const gstValue = taxableAfterDiscount * (item.gstRate / 100)
      const cgst = sameStateSupply ? gstValue / 2 : 0
      const sgst = sameStateSupply ? gstValue / 2 : 0
      const igst = sameStateSupply ? 0 : gstValue
      const lineTotal = taxableAfterDiscount + gstValue

      return {
        ...item,
        taxableAfterDiscount,
        discountShare,
        gstValue,
        cgst,
        sgst,
        igst,
        lineTotal,
      }
    })

    const taxableAfterDiscount = lineRows.reduce(
      (sum, item) => sum + item.taxableAfterDiscount,
      0
    )
    const cgst = lineRows.reduce((sum, item) => sum + item.cgst, 0)
    const sgst = lineRows.reduce((sum, item) => sum + item.sgst, 0)
    const igst = lineRows.reduce((sum, item) => sum + item.igst, 0)
    const totalTax = cgst + sgst + igst
    const grandTotal = taxableAfterDiscount + totalTax + shipping
    const effectiveAmountPaid = Math.min(amountPaid, grandTotal)
    const balanceDue = Math.max(grandTotal - effectiveAmountPaid, 0)
    const paymentStatus =
      grandTotal <= 0
        ? 'Draft'
        : balanceDue === 0
          ? 'Paid'
          : effectiveAmountPaid > 0
            ? 'Partially Paid'
            : 'Unpaid'

    return {
      lineRows,
      subtotal,
      discount,
      taxableAfterDiscount,
      shipping,
      cgst,
      sgst,
      igst,
      totalTax,
      grandTotal,
      amountPaid: effectiveAmountPaid,
      balanceDue,
      paymentStatus,
      sameStateSupply,
    }
  }, [
    adjustments.amountPaid,
    adjustments.discount,
    adjustments.shipping,
    items,
    meta.placeOfSupply,
    seller.state,
  ])

  const validationMessage = useMemo(() => {
    if (!seller.businessName.trim() && !seller.name.trim()) {
      return 'Enter your business or seller name.'
    }

    if (!client.businessName.trim() && !client.name.trim()) {
      return 'Enter the client name or business name.'
    }

    if (!meta.invoiceNumber.trim()) {
      return 'Enter an invoice number.'
    }

    if (!computedInvoice.lineRows.length) {
      return 'Add at least one invoice line item.'
    }

    const hasInvalidLine = items.some((item) => {
      if (!item.description.trim()) {
        return true
      }

      return (
        Number(item.quantity) <= 0 ||
        Number(item.unitPrice) < 0 ||
        Number(item.gstRate) < 0
      )
    })

    if (hasInvalidLine) {
      return 'Each line item needs a description, quantity, unit price, and GST rate.'
    }

    return ''
  }, [
    client.businessName,
    client.name,
    computedInvoice.lineRows.length,
    items,
    meta.invoiceNumber,
    seller.businessName,
    seller.name,
  ])

  const businessTitle = seller.businessName || seller.name || 'Your Business'
  const businessSubtitle = [
    seller.name,
    seller.address,
    seller.phone,
    seller.email,
  ]
    .filter(Boolean)
    .join('\n')
  const sellerPreviewSubtitle = [seller.name, seller.address]
    .filter(Boolean)
    .join('\n')
  const clientPreviewSubtitle = [client.name, client.address]
    .filter(Boolean)
    .join('\n')
  const invoiceDetailsEntries = [
    { label: 'Invoice No.', value: meta.invoiceNumber || 'N/A' },
    {
      label: 'Invoice Date',
      value: formatDateLabel(meta.invoiceDate, numberLocale),
    },
    { label: 'Due Date', value: formatDateLabel(meta.dueDate, numberLocale) },
    { label: 'Seller GSTIN', value: seller.gstin || 'N/A' },
    { label: 'Client GSTIN', value: client.gstin || 'N/A' },
    { label: 'Place of Supply', value: meta.placeOfSupply || 'N/A' },
  ]
  const totalsEntries = [
    { label: 'Subtotal', value: computedInvoice.subtotal },
    { label: 'Discount', value: computedInvoice.discount },
    {
      label: 'Taxable After Discount',
      value: computedInvoice.taxableAfterDiscount,
    },
    ...(computedInvoice.sameStateSupply
      ? [
          { label: 'CGST', value: computedInvoice.cgst },
          { label: 'SGST', value: computedInvoice.sgst },
        ]
      : [{ label: 'IGST', value: computedInvoice.igst }]),
    { label: 'Shipping / Extra', value: computedInvoice.shipping },
    { label: 'Grand Total', value: computedInvoice.grandTotal, emphasis: true },
    { label: 'Amount Paid', value: computedInvoice.amountPaid },
    { label: 'Balance Due', value: computedInvoice.balanceDue, emphasis: true },
  ]
  const paymentTermsText = meta.paymentTerms || 'Payment due by the due date.'
  const notesText = meta.notes || 'Thank you for your business.'

  function updateItem(
    id: string,
    field: keyof Omit<InvoiceLineItem, 'id'>,
    value: string
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    )
  }

  function handleReset() {
    setSeller(DEFAULT_SELLER)
    setClient(DEFAULT_CLIENT)
    setMeta({
      ...DEFAULT_META,
      invoiceDate: getTodayInputValue(),
      dueDate: getFutureInputValue(14),
    })
    setAdjustments(DEFAULT_ADJUSTMENTS)
    setItems([
      createLineItem({
        description: 'Website homepage redesign',
        quantity: '1',
        unitPrice: '18000',
        gstRate: '18',
      }),
      createLineItem({
        description: 'Product launch banner set',
        quantity: '3',
        unitPrice: '3500',
        gstRate: '18',
      }),
    ])
    setCurrencyCode(detectDefaultCurrency().code)
  }

  function handlePrint() {
    if (validationMessage) {
      setSnackbarMessage(validationMessage)
      return
    }

    const printFrame = document.createElement('iframe')
    printFrame.style.position = 'fixed'
    printFrame.style.right = '0'
    printFrame.style.bottom = '0'
    printFrame.style.width = '0'
    printFrame.style.height = '0'
    printFrame.style.border = '0'

    document.body.appendChild(printFrame)

    const frameWindow = printFrame.contentWindow

    if (!frameWindow) {
      document.body.removeChild(printFrame)
      setSnackbarMessage('Unable to open the print preview right now.')
      return
    }

    const cleanup = () => {
      window.setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame)
        }
      }, 1200)
    }

    const markup = buildPrintMarkup({
      businessTitle,
      businessSubtitle,
      paymentStatus: computedInvoice.paymentStatus,
      invoiceDetails: invoiceDetailsEntries,
      sellerBlock: {
        title: seller.businessName || seller.name || 'Seller',
        subtitle: sellerPreviewSubtitle,
      },
      clientBlock: {
        title: client.businessName || client.name || 'Client',
        subtitle: clientPreviewSubtitle,
      },
      lineRows: computedInvoice.lineRows.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
        taxableValue: item.taxableAfterDiscount,
        gstValue: item.gstValue,
        lineTotal: item.lineTotal,
      })),
      totalsRows: totalsEntries,
      paymentTerms: paymentTermsText,
      notes: notesText,
      currencySymbol: selectedCurrency.symbol,
      numberLocale,
    })

    frameWindow.document.open()
    frameWindow.document.write(markup)
    frameWindow.document.close()

    frameWindow.onload = () => {
      window.setTimeout(() => {
        frameWindow.focus()
        frameWindow.print()
        cleanup()
      }, 250)
    }
  }

  return (
    <>
      <Stack spacing={{ xs: 2.5, md: 2 }}>
        <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
          <Stack spacing={{ xs: 3, md: 2.5 }}>
            <Box sx={{ maxWidth: 820 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 0.75 }}
              >
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: '1.55rem', md: '1.8rem' } }}
                >
                  Invoice Generator
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
              >
                Create a GST-friendly invoice, review the live preview, and
                print or save it as a PDF directly from your browser.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 1.75 }}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={{ xs: 2, md: 1.75 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<AutorenewRoundedIcon />}
                        onClick={handleReset}
                        sx={{ borderRadius: 0 }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<PrintRoundedIcon />}
                        onClick={handlePrint}
                        sx={{ borderRadius: 0 }}
                      >
                        Print / Save as PDF
                      </Button>
                    </Stack>

                    {validationMessage ? (
                      <Alert severity="warning" sx={{ borderRadius: 0 }}>
                        {validationMessage}
                      </Alert>
                    ) : null}

                    <Divider flexItem sx={{ my: 0.25 }} />

                    <Box
                      sx={{
                        display: 'grid',
                        rowGap: { xs: 1.75, md: 1.5 },
                      }}
                    >
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Seller Details
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="Business Name"
                        value={seller.businessName}
                        onChange={(event) =>
                          setSeller((current) => ({
                            ...current,
                            businessName: event.target.value,
                          }))
                        }
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Contact Name"
                        value={seller.name}
                        onChange={(event) =>
                          setSeller((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        label="Address"
                        value={seller.address}
                        onChange={(event) =>
                          setSeller((current) => ({
                            ...current,
                            address: event.target.value,
                          }))
                        }
                        sx={{ mb: { xs: 0.5, md: 0.375 } }}
                      />
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                          },
                          columnGap: { xs: 1.25, md: 1 },
                          rowGap: { xs: 1.25, md: 1 },
                          mt: { xs: 0.5, md: 0.375 },
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Phone"
                          value={seller.phone}
                          onChange={(event) =>
                            setSeller((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Email"
                          value={seller.email}
                          onChange={(event) =>
                            setSeller((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Seller GSTIN"
                          value={seller.gstin}
                          onChange={(event) =>
                            setSeller((current) => ({
                              ...current,
                              gstin: event.target.value.toUpperCase(),
                            }))
                          }
                        />
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Seller State"
                          value={seller.state}
                          onChange={(event) =>
                            setSeller((current) => ({
                              ...current,
                              state: event.target.value,
                            }))
                          }
                        >
                          {INDIAN_STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Box>

                    <Divider flexItem sx={{ my: 0.25 }} />

                    <Stack spacing={{ xs: 1.75, md: 1.5 }}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Client Details
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="Client Business"
                        value={client.businessName}
                        onChange={(event) =>
                          setClient((current) => ({
                            ...current,
                            businessName: event.target.value,
                          }))
                        }
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Client Name"
                        value={client.name}
                        onChange={(event) =>
                          setClient((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        label="Client Address"
                        value={client.address}
                        onChange={(event) =>
                          setClient((current) => ({
                            ...current,
                            address: event.target.value,
                          }))
                        }
                        sx={{ mb: { xs: 0.5, md: 0.375 } }}
                      />
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                          },
                          columnGap: { xs: 1.25, md: 1 },
                          rowGap: { xs: 1.25, md: 1 },
                          mt: { xs: 0.5, md: 0.375 },
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Client GSTIN"
                          value={client.gstin}
                          onChange={(event) =>
                            setClient((current) => ({
                              ...current,
                              gstin: event.target.value.toUpperCase(),
                            }))
                          }
                        />
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Place of Supply"
                          value={meta.placeOfSupply}
                          onChange={(event) =>
                            setMeta((current) => ({
                              ...current,
                              placeOfSupply: event.target.value,
                            }))
                          }
                        >
                          {INDIAN_STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Stack>

                    <Divider flexItem sx={{ my: 0.25 }} />

                    <Stack spacing={{ xs: 1.75, md: 1.5 }}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Invoice Details
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                          },
                          columnGap: { xs: 1.25, md: 1 },
                          rowGap: { xs: 1.25, md: 1 },
                          mt: { xs: 0.35, md: 0.25 },
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Invoice Number"
                          value={meta.invoiceNumber}
                          onChange={(event) =>
                            setMeta((current) => ({
                              ...current,
                              invoiceNumber: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Currency"
                          value={currencyCode}
                          onChange={(event) =>
                            setCurrencyCode(event.target.value)
                          }
                        >
                          {currencyOptions.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                              {option.code}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                          },
                          columnGap: { xs: 1.25, md: 1 },
                          rowGap: { xs: 1.25, md: 1 },
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="Invoice Date"
                          value={meta.invoiceDate}
                          onChange={(event) =>
                            setMeta((current) => ({
                              ...current,
                              invoiceDate: event.target.value,
                            }))
                          }
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="Due Date"
                          value={meta.dueDate}
                          onChange={(event) =>
                            setMeta((current) => ({
                              ...current,
                              dueDate: event.target.value,
                            }))
                          }
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        label="Payment Terms"
                        value={meta.paymentTerms}
                        onChange={(event) =>
                          setMeta((current) => ({
                            ...current,
                            paymentTerms: event.target.value,
                          }))
                        }
                      />
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        label="Notes"
                        value={meta.notes}
                        onChange={(event) =>
                          setMeta((current) => ({
                            ...current,
                            notes: event.target.value,
                          }))
                        }
                      />
                    </Stack>

                    <Divider flexItem sx={{ my: 0.25 }} />

                    <Stack spacing={{ xs: 1.75, md: 1.5 }}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Line Items
                      </Typography>
                      {items.map((item, index) => (
                        <Box
                          key={item.id}
                          sx={{
                            p: { xs: 1.5, md: 1.35 },
                            border: '1px solid rgba(11, 31, 51, 0.08)',
                            backgroundColor: 'rgba(255,255,255,0.68)',
                          }}
                        >
                          <Stack spacing={{ xs: 1.5, md: 1.25 }}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography sx={{ fontWeight: 600 }}>
                                Item {index + 1}
                              </Typography>
                              <Button
                                variant="text"
                                color="inherit"
                                size="small"
                                startIcon={<DeleteOutlineRoundedIcon />}
                                onClick={() =>
                                  setItems((currentItems) =>
                                    currentItems.length > 1
                                      ? currentItems.filter(
                                          (currentItem) =>
                                            currentItem.id !== item.id
                                        )
                                      : currentItems
                                  )
                                }
                                disabled={items.length === 1}
                              >
                                Remove
                              </Button>
                            </Stack>
                            <TextField
                              fullWidth
                              size="small"
                              label="Description"
                              value={item.description}
                              onChange={(event) =>
                                updateItem(
                                  item.id,
                                  'description',
                                  event.target.value
                                )
                              }
                            />
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                  xs: '1fr',
                                  sm: 'repeat(3, minmax(0, 1fr))',
                                },
                                columnGap: { xs: 1.25, md: 1 },
                                rowGap: { xs: 1.25, md: 1 },
                              }}
                            >
                              <TextField
                                fullWidth
                                size="small"
                                label="Quantity"
                                value={item.quantity}
                                onChange={(event) =>
                                  updateItem(
                                    item.id,
                                    'quantity',
                                    sanitizeNumericInput(
                                      event.target.value,
                                      true
                                    )
                                  )
                                }
                              />
                              <TextField
                                fullWidth
                                size="small"
                                label="Unit Price"
                                value={item.unitPrice}
                                onChange={(event) =>
                                  updateItem(
                                    item.id,
                                    'unitPrice',
                                    sanitizeNumericInput(
                                      event.target.value,
                                      true
                                    )
                                  )
                                }
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {selectedCurrency.symbol}
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                label="GST %"
                                value={item.gstRate}
                                onChange={(event) =>
                                  updateItem(
                                    item.id,
                                    'gstRate',
                                    sanitizeNumericInput(
                                      event.target.value,
                                      true
                                    )
                                  )
                                }
                              />
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<AddRoundedIcon />}
                        onClick={() =>
                          setItems((currentItems) => [
                            ...currentItems,
                            createLineItem({
                              description: 'Additional service',
                              quantity: '1',
                              unitPrice: '0',
                              gstRate: '18',
                            }),
                          ])
                        }
                        sx={{ alignSelf: 'flex-start', borderRadius: 0 }}
                      >
                        Add Line Item
                      </Button>
                    </Stack>

                    <Divider flexItem sx={{ my: 0.25 }} />

                    <Stack spacing={{ xs: 1.75, md: 1.5 }}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Adjustments
                      </Typography>
                      <Grid container spacing={{ xs: 1.25, md: 1 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Discount"
                            value={adjustments.discount}
                            onChange={(event) =>
                              setAdjustments((current) => ({
                                ...current,
                                discount: sanitizeNumericInput(
                                  event.target.value,
                                  true
                                ),
                              }))
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {selectedCurrency.symbol}
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Shipping / Extra"
                            value={adjustments.shipping}
                            onChange={(event) =>
                              setAdjustments((current) => ({
                                ...current,
                                shipping: sanitizeNumericInput(
                                  event.target.value,
                                  true
                                ),
                              }))
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {selectedCurrency.symbol}
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Amount Paid"
                            value={adjustments.amountPaid}
                            onChange={(event) =>
                              setAdjustments((current) => ({
                                ...current,
                                amountPaid: sanitizeNumericInput(
                                  event.target.value,
                                  true
                                ),
                              }))
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {selectedCurrency.symbol}
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, lg: 7 }}>
                <Paper
                  sx={(theme) => ({
                    ...getCalculatorPanelSx(theme),
                    minHeight: '100%',
                  })}
                >
                  <Stack spacing={1.5}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={1}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Box>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          Live Invoice Preview
                        </Typography>
                        <Typography color="text.secondary">
                          {computedInvoice.sameStateSupply
                            ? 'GST split as CGST + SGST'
                            : 'GST applied as IGST'}
                        </Typography>
                      </Box>
                      <Chip
                        label={computedInvoice.paymentStatus}
                        color={
                          computedInvoice.paymentStatus === 'Paid'
                            ? 'success'
                            : computedInvoice.paymentStatus === 'Partially Paid'
                              ? 'warning'
                              : 'default'
                        }
                        variant="outlined"
                        sx={{ borderRadius: 0 }}
                      />
                    </Stack>

                    <Box
                      sx={(theme) => ({
                        p: { xs: 1.1, md: 1.25 },
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(8, 14, 24, 0.82)'
                            : '#fff',
                      })}
                    >
                      <Stack spacing={0}>
                        <Box
                          sx={{
                            pb: 1.2,
                            borderBottom: '1px solid rgba(11, 31, 51, 0.08)',
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              md: '1.05fr 0.95fr',
                            },
                            gap: { xs: 1.1, md: 1.5 },
                          }}
                        >
                          <Stack spacing={0.75}>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Tax Invoice
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{
                                fontSize: { xs: '1.05rem', md: '1.22rem' },
                                lineHeight: 1.2,
                              }}
                            >
                              {businessTitle}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              sx={{
                                whiteSpace: 'pre-line',
                                fontSize: '0.84rem',
                                lineHeight: 1.5,
                              }}
                            >
                              {businessSubtitle}
                            </Typography>
                          </Stack>

                          <Box>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: 0.55,
                              }}
                            >
                              {invoiceDetailsEntries.map(({ label, value }) => (
                                <Stack
                                  key={label}
                                  direction="row"
                                  justifyContent="space-between"
                                  spacing={1.5}
                                  sx={{
                                    pb: 0.45,
                                    borderBottom:
                                      '1px solid rgba(11, 31, 51, 0.07)',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.72rem' }}
                                  >
                                    {label}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: '0.78rem',
                                      textAlign: 'right',
                                      lineHeight: 1.35,
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                </Stack>
                              ))}
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            py: 1.1,
                            borderBottom: '1px solid rgba(11, 31, 51, 0.08)',
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              md: 'repeat(2, minmax(0, 1fr))',
                            },
                            gap: { xs: 1, md: 1.5 },
                          }}
                        >
                          <Box>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Bill From
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.45,
                                fontWeight: 700,
                                fontSize: '0.92rem',
                              }}
                            >
                              {seller.businessName || seller.name || 'Seller'}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              sx={{
                                mt: 0.4,
                                whiteSpace: 'pre-line',
                                fontSize: '0.8rem',
                                lineHeight: 1.45,
                              }}
                            >
                              {sellerPreviewSubtitle}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Bill To
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.45,
                                fontWeight: 700,
                                fontSize: '0.92rem',
                              }}
                            >
                              {client.businessName || client.name || 'Client'}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              sx={{
                                mt: 0.4,
                                whiteSpace: 'pre-line',
                                fontSize: '0.8rem',
                                lineHeight: 1.45,
                              }}
                            >
                              {clientPreviewSubtitle}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            py: 1.1,
                            borderBottom: '1px solid rgba(11, 31, 51, 0.08)',
                          }}
                        >
                          <Box
                            sx={{
                              pb: 0.7,
                            }}
                          >
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Line Items
                            </Typography>
                          </Box>
                          <Box sx={{ overflowX: 'auto' }}>
                            <Box
                              component="table"
                              sx={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                '& th, & td': {
                                  borderBottom:
                                    '1px solid rgba(11, 31, 51, 0.08)',
                                  p: 0.7,
                                  fontSize: '0.78rem',
                                  textAlign: 'left',
                                  verticalAlign: 'top',
                                },
                                '& th': {
                                  backgroundColor: 'rgba(243, 247, 249, 0.92)',
                                  fontWeight: 700,
                                },
                                '& td, & th': {
                                  '&:first-of-type': {
                                    pl: { xs: 1.1, md: 1.2 },
                                  },
                                  '&:last-of-type': {
                                    pr: { xs: 1.1, md: 1.2 },
                                  },
                                },
                                '& tbody tr:last-child td': {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Description</th>
                                  <th>Qty</th>
                                  <th>Unit Price</th>
                                  <th>GST</th>
                                  <th>Taxable</th>
                                  <th>Tax</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {computedInvoice.lineRows.map((item, index) => (
                                  <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.description}</td>
                                    <td>
                                      {formatNumber(
                                        item.quantity,
                                        numberLocale,
                                        {
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                    </td>
                                    <td>
                                      {selectedCurrency.symbol}{' '}
                                      {formatNumber(
                                        item.unitPrice,
                                        numberLocale
                                      )}
                                    </td>
                                    <td>{item.gstRate}%</td>
                                    <td>
                                      {selectedCurrency.symbol}{' '}
                                      {formatNumber(
                                        item.taxableAfterDiscount,
                                        numberLocale
                                      )}
                                    </td>
                                    <td>
                                      {selectedCurrency.symbol}{' '}
                                      {formatNumber(
                                        item.gstValue,
                                        numberLocale
                                      )}
                                    </td>
                                    <td>
                                      {selectedCurrency.symbol}{' '}
                                      {formatNumber(
                                        item.lineTotal,
                                        numberLocale
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            py: 0.8,
                            borderBottom: '1px solid rgba(11, 31, 51, 0.08)',
                          }}
                        >
                          <Box
                            sx={{
                              pb: 0.45,
                            }}
                          >
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Totals
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: '100%',
                            }}
                          >
                            {totalsEntries.map(({ label, value, emphasis }) => (
                              <Stack
                                key={label}
                                direction="row"
                                justifyContent="space-between"
                                spacing={2}
                                sx={{
                                  px: { xs: 1.1, md: 1.2 },
                                  py: 0.6,
                                  borderBottom:
                                    '1px solid rgba(11, 31, 51, 0.08)',
                                  '&:last-of-type': {
                                    borderBottom: 0,
                                  },
                                }}
                              >
                                <Typography
                                  color={
                                    emphasis ? 'text.primary' : 'text.secondary'
                                  }
                                  sx={{
                                    fontWeight: emphasis ? 700 : 500,
                                    fontSize: '0.84rem',
                                  }}
                                >
                                  {label}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: emphasis ? 700 : 600,
                                    fontSize: '0.84rem',
                                  }}
                                >
                                  {selectedCurrency.symbol}{' '}
                                  {formatNumber(value, numberLocale)}
                                </Typography>
                              </Stack>
                            ))}
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            pt: 0.65,
                          }}
                        >
                          <Typography variant="overline" color="text.secondary">
                            Payment Terms
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.2,
                              fontSize: '0.76rem',
                              lineHeight: 1.35,
                            }}
                          >
                            {paymentTermsText}
                          </Typography>
                          <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ mt: 0.65, display: 'block' }}
                          >
                            Notes
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.2,
                              fontSize: '0.76rem',
                              lineHeight: 1.35,
                            }}
                          >
                            {notesText}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={2600}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </>
  )
}

export default InvoiceGenerator

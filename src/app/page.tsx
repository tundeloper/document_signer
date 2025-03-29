"use client"
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconButton, Tooltip, MenuItem, Select } from "@mui/material";
import { Card, CardContent } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { motion } from "framer-motion";

interface Annotation {
  type: "highlight" | "underline" | "signature" | "comment";
  position: { x: number; y: number };
  color?: string;
  text?: string;
}

export default function DocumentSigner() {
  const [file, setFile] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [mode, setMode] = useState<"highlight" | "underline" | "signature" | "comment" | null>(null);
  const [color, setColor] = useState<string>("yellow");
  const [comment, setComment] = useState<string>("");

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === "application/pdf");
    if (pdfFiles.length > 0) {
      const uploadedFileURL = URL.createObjectURL(pdfFiles[0]);
      setFile(uploadedFileURL);
      window.open(uploadedFileURL, "_blank");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: true
  });

  const handleAnnotation = (type: "highlight" | "underline" | "signature" | "comment") => {
    setMode(type);
  };

  const addAnnotation = (event: React.MouseEvent) => {
    if (!mode) return;
    const newAnnotation: Annotation = {
      type: mode,
      position: { x: event.clientX, y: event.clientY },
      color: mode === "highlight" || mode === "underline" ? color : undefined,
      text: mode === "comment" ? comment : undefined,
    };
    setAnnotations([...annotations, newAnnotation]);
    if (mode === "comment") setComment("");
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">Document Signer & Annotation Tool</h1>
      <div className="flex space-x-4">
        {/* <Tooltip title="Upload PDF">
          <IconButton color="primary" onClick={() => document.getElementById("file-input")?.click()}>
            <UploadFileIcon />
          </IconButton>
        </Tooltip> */}
        <input
          id="file-input"
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => onDrop(Array.from(e.target.files || []))}
        />
        <Tooltip title="Highlight">
          <IconButton color={mode === "highlight" ? "secondary" : "default"} onClick={() => handleAnnotation("highlight")}>
            <BorderColorIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton color={mode === "underline" ? "secondary" : "default"} onClick={() => handleAnnotation("underline")}>
            <FormatUnderlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Signature">
          <IconButton color={mode === "signature" ? "secondary" : "default"} onClick={() => handleAnnotation("signature")}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Comment">
          <IconButton color={mode === "comment" ? "secondary" : "default"} onClick={() => handleAnnotation("comment")}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export PDF">
          <IconButton color="success" onClick={() => console.log("Export PDF")}> 
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </div>
      {mode && (mode === "highlight" || mode === "underline") && (
        <Select value={color} onChange={(e) => setColor(e.target.value)}>
          <MenuItem value="yellow">Yellow</MenuItem>
          <MenuItem value="red">Red</MenuItem>
          <MenuItem value="blue">Blue</MenuItem>
        </Select>
      )}
      {mode === "comment" && (
        <input
          type="text"
          placeholder="Enter comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2"
        />
      )}
      <Card
        {...getRootProps()}
        className={`w-full max-w-4xl h-[600px] flex items-center justify-center border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
        onClick={addAnnotation}
      >
        <CardContent className="w-full h-full flex items-center justify-center relative">
          <input {...getInputProps()} />
          {file ? (
            <iframe src={file} className="w-full h-full" title="PDF Viewer" />
          ) : (
            <motion.p
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-500"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {isDragActive ? "Drop the PDF here..." : "Drag & drop a PDF or click to upload"}
            </motion.p>
          )}
          {annotations.map((ann, index) => (
            <div
              key={index}
              style={{ position: "absolute", left: ann.position.x, top: ann.position.y, color: ann.color }}
              className={ann.type === "underline" ? "border-b-2" : "bg-opacity-50 p-1"}
            >
              {ann.text || "✍"}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

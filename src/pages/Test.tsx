import { FactoryLogContextProvider } from "../Components/modd/Table/FactoryLog/FactoryLogContext";
import Container from "../Components/modd/Table/FactoryLog/Chart/Container";
import BubbleChart from "../Components/modd/Table/FactoryLog/Chart/BubbleChart";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  pdf,
} from "@react-pdf/renderer";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
export default function Chart() {
  const [file, setFile] = useState<FileList | null>(null);
  const [previewImgUrls, setPreviewImgUrls] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const herfRef = useRef<HTMLAnchorElement>(null);



  function createCSV() {
    const rows = [
      ["Name", "Age", "Email"],
      ["Alice測試", "25", "alice@example.com"],
      ["Bob", "30", "bob@example.com"],
    ];
    // syntax for data url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
    // data:[<mediatype>][;base64],<data>
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    console.log(csvContent);
    return csvContent;
  }
  createCSV();
  function downloadCSV(csvContent: string) {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // const csvContent = createCSV();
  // downloadCSV(csvContent);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event.target.files);
    setFile(event.target.files);

    if (event.target.files) {
      // const filesNumber = event.target.files.length;
      // for (let i = 0; i < filesNumber; i++) {
      //   try {
      //     const file = event.target.files[i];
      //     const url = await fileToDataString(file);
      //     setPreviewImgUrls([...previewImgUrls, url]);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      try {
        const file = event.target.files[0];
        const url = await fileToDataString(file);
        setPreviewImgUrls([...previewImgUrls, url]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const test = URL;
  const test2 = window.URL;

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "white",
      color: "white",
    },
    section: {
      margin: 10,
      padding: 10,
    },
    viewer: {
      width: window.innerWidth, //the pdf viewer will take up all of the width and height
      height: window.innerHeight,
    },
  });
  function returnFileSize(number: number) {
    if (number < 1e3) {
      return `${number} bytes`;
    } else if (number >= 1e3 && number < 1e6) {
      return `${(number / 1e3).toFixed(1)} KB`;
    } else {
      return `${(number / 1e6).toFixed(1)} MB`;
    }
  }

  const downloadPDF = async () => {
    const fileName = "test.pdf";
    const blob = await pdf(
      <Document>
        {/*render a single page*/}
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View
            style={{
              display: "flex",
              borderTop: "1px solid black",
              flexDirection: "row",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
          </View>
          <View style={styles.section}>
            <Text>World</Text>
          </View>
        </Page>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View
            style={{
              display: "flex",
              borderTop: "1px solid black",
              flexDirection: "row",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
            <Text
              style={{
                color: "red",
                border: "1px solid black",
                flexGrow: 1,
                alignContent: "center",
              }}
            >
              213
            </Text>
          </View>
          <View style={styles.section}>
            <Text>World</Text>
          </View>
        </Page>
      </Document>,
    ).toBlob();
    saveAs(blob, fileName);
  };
  return (
    <>
      {/* <BubbleChart /> */}
      <form action="" className="flex flex-col gap-4 border border-black">
        <label htmlFor="file">User Upload File</label>
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />
      </form>
      <div>
        {file &&
          Array.from(file).map((file) => (
            <div key={file.name}>
              {file.name} - {returnFileSize(file.size)}
            </div>
          ))}
      </div>
      <div>
        {previewImgUrls.map((url, index) => (
          <>
            <img alt="" src={url} key={url.slice(0, 10) + index} />

            {/* <a href={url} download={file?.[index].name}>
              {file?.[index].name}
            </a> */}
          </>
        ))}
      </div>
      <button
        type="button"
        onClick={() => downloadCSV(createCSV())}
        className="border border-black"
      >
        download
      </button>
      <PDFViewer
        style={styles.viewer}
        // showToolbar={false}
      >
        {/* Start of the document*/}
        <Document>
          {/*render a single page*/}
          <Page size="A4" orientation="landscape" style={styles.page}>
            <View
              style={{
                display: "flex",
                borderTop: "1px solid black",
                flexDirection: "row",
                flexGrow: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "red",
                  border: "1px solid black",
                  flexGrow: 1,
                  alignContent: "center",
                }}
              >
                213
              </Text>
              <Text
                style={{
                  color: "red",
                  border: "1px solid black",
                  flexGrow: 1,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                213
              </Text>
              <Text
                style={{
                  color: "red",
                  border: "1px solid black",
                  flexGrow: 1,
                  alignContent: "center",
                }}
              >
                213
              </Text>
              <Text
                style={{
                  color: "red",
                  border: "1px solid black",
                  flexGrow: 1,
                  alignContent: "center",
                }}
              >
                213
              </Text>
              <Text
                style={{
                  color: "red",
                  border: "1px solid black",
                  flexGrow: 1,
                  alignContent: "center",
                }}
              >
                213
              </Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
      ,
      <div className="outline">
        <button onClick={downloadPDF}>download pdf</button>
      </div>
    </>
  );
}

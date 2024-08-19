
import { useState } from "react";
import Modal from "../Components/modd/Modal/NonDialogModal";
export default function Chart() {
  const [file, setFile] = useState<FileList | null>(null);
  const [previewImgUrls, setPreviewImgUrls] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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
  // function downloadCSV(csvContent: string) {
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "data.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  // const csvContent = createCSV();
  // downloadCSV(csvContent);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event.target.files);

    if (event.target.files) {
      try {
        for (const file of event.target.files) {
          const url = await fileToDataString(file);
          setPreviewImgUrls((prev) => [...prev, url]);
        }
        setFile(event.target.files);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
  function returnFileSize(number: number) {
    if (number < 1e3) {
      return `${number} bytes`;
    } else if (number >= 1e3 && number < 1e6) {
      return `${(number / 1e3).toFixed(1)} KB`;
    } else {
      return `${(number / 1e6).toFixed(1)} MB`;
    }
  }

  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}></Modal>
      <form
        action=""
        className="mx-20 mt-10 flex flex-col gap-4 border border-black p-2"
      >
        <label htmlFor="file" hidden>
          User Upload File
        </label>
        <input
          type="file"
          name="file"
          id="file"
          title="import csv file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />

        <div>
          {file &&
            Array.from(file).map((file, index) => (
              <>
                <div className="flex gap-2" key={file.name}>
                  {file.name} - {returnFileSize(file.size)}
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-40 object-scale-down"
                    // className="w-40 object-contain"
                    // className="w-5 object-contain"
                  />
                  <a
                    className="ml-2 text-blue-400 underline"
                    href={URL.createObjectURL(file)}
                  >
                    preview {index}
                  </a>
                </div>
              </>
            ))}
        </div>
      </form>

      <div className="w-40">
        {previewImgUrls.map((url, index) => (
          <>
            <img
              alt=""
              src={url}
              className="object-contain"
              key={url.slice(0, 10) + index}
            />
          </>
        ))}
      </div>
      {/* <button
        type="button"
        onClick={() => downloadCSV(createCSV())}
        className="border border-black"
      >
        download
      </button>

      <div className="outline">
        <button onClick={downloadPDF}>download pdf</button>
      </div> */}
    </>
  );
}

import { Component, OnInit } from '@angular/core';
import { worker } from 'cluster';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-transposer',
  templateUrl: './transposer.component.html',
  styleUrls: ['./transposer.component.css']
})
export class TransposerComponent implements OnInit {

  // inputs
  separator: string = ',';
  fieldCount: number = 3;

  // outputs
  outputLinesPerFile: number = 1000;
  outputSeparator: string = ',';
  outputExtension: string = 'csv';
  
  // selected fields
  allFields: any[] = []
  selectedFields: any[] = []

  // page state
  processing: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.updateSelectableFields();
  }

  handleFileUpload(event: any) {
    try {
      if (this.selectedFields.length == 0) {
        alert('At least one field must be selected');
      } else {
        console.log(event);
        this.readFile(event.files[0]);
      }
    } catch (exception) {
      console.error(exception);
      alert("There was a problem processing your file");
    }

  }

  updateSelectableFields() {
    this.allFields = [];

    for (let i = 0 ; i < this.fieldCount; i++) {
      const label = 'Field ' + i;
      const value = i;
      const item = {label: label, value: value};
      this.allFields.push(item);
    }

    this.selectedFields = [];
    // for (let i = 0; i < this.selectedFields.length; i++) {
    //   const selected = this.selectedFields[i];
    //   if (selected.value >= this.fieldCount) {
    //     this.selectedFields.splice(i,1);
    //     console.log("removing element at " + i, selected);
    //   }
    // }

    console.log("all fields", this.allFields);
    console.log("selected fields", this.selectedFields);
  }

  readFile(file: File) {
    let count = 0;
    const chunkSize = this.outputLinesPerFile;
    const estimatedFileCount = Math.ceil(file.size/chunkSize);
    const selectedFields = this.selectedFields;
    const separator = this.separator;
    const outputSeparator = this.outputSeparator;
    const outputFileExtension = this.outputExtension;

      Papa.parse(file, {
        delimiter: separator,
        skipEmptyLines:true,
        chunkSize: chunkSize,
        chunk: function (result, parser) {
          parser.pause();

          // handle the file reading
          let desiredLines = [];
          const lines: any[] = result.data;
          for (const line of lines) {
            const desiredTokens = [];

            for (const field of selectedFields) {
              let index = field.value;
              let desiredToken = line[index];
              desiredTokens.push(desiredToken);
            }
        
            let desiredLine = desiredTokens.join(outputSeparator);
            desiredLines.push(desiredLine);
          }
      
          let desiredText = desiredLines.join('\r\n');
          const processedFile = desiredText;
          
          // console.log("resultFile", processedFile);

          count++;
          console.log("hit chunk (" + count + "/" + estimatedFileCount + ") of length: ", result.data.length);
          // const desiredFileName = this.getDesiredFileName(file);
          const processedFileName = 'testFile_' + count + '_of_' + estimatedFileCount + '.' + outputFileExtension;
          var blob = new Blob([processedFile], {type: 'text/csv'});
          if(window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveBlob(blob, processedFileName);
          }
          else{
              var elem = window.document.createElement('a');
              elem.href = window.URL.createObjectURL(blob);
              elem.download = processedFileName;        
              document.body.appendChild(elem);
              elem.click();        
              document.body.removeChild(elem);
          }

          parser.resume();
        },
        complete: function (result, file) {
            console.log("Completed parsing");
        }
    });
   
  }

  getDesiredFileName(file: File) {
    const originalName = file.name;
    const dotIndex = originalName.indexOf('.');
    const hasDot = (dotIndex >= 0);
    let desiredName = '';
    const now = new Date();
    const timestampString = this.createTimestampString();
    if (hasDot) {
      const fileName = originalName.substring(0,dotIndex);
      const fileExtension = originalName.substring(dotIndex, originalName.length);
      desiredName = fileName + '_' + timestampString + fileExtension;
    } else {
      desiredName = originalName +  + '_' + timestampString;
    }

    return desiredName;
  }

  createTimestampString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const sep = '-';
    const longsep = '_';
    const result = year + sep + month + sep + day + longsep + hour + sep + minutes + sep + seconds;
    return result;
  }

  createDesiredLine(tokens: string[]) {
    // const tokens = originalLine.split(this.separator);
    const desiredTokens = [];

    for (const field of this.selectedFields) {
      let index = field.value;
      let desiredToken = tokens[index];
      desiredTokens.push(desiredToken);
    }

    let desiredLine = desiredTokens.join(this.separator);
    return desiredLine;
  }

  toggleOverlay() {
    this.processing = true;
  }
}

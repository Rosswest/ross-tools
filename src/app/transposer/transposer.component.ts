import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transposer',
  templateUrl: './transposer.component.html',
  styleUrls: ['./transposer.component.css']
})
export class TransposerComponent implements OnInit {

  separator: string = ',';
  fieldCount: number = 3;
  processing: boolean = false;

  allFields: any[] = []
  selectedFields: any[] = []

  processedFile: string;
  processedFileName: string;
  showDownloadButton: boolean = false;

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
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const desiredFileName = this.getDesiredFileName(file);
        this.handleFileReadResult(event,desiredFileName);
      });
      reader.readAsText(file);
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

  handleFileReadResult(event: any, desiredFileName: string) {
    const result = event.target.result;
    console.log(event);
    // const fileExtension;
    // const fileName; 
    const lines = result.match(/[^\r\n]+/g);
    let desiredLines = [];

    for (const line of lines) {
      const desiredLine = this.createDesiredLine(line);
      desiredLines.push(desiredLine);
    }

    console.log("original lines", lines);
    console.log("desired lines", desiredLines);
    alert(lines.length + " lines read");

    let desiredText = desiredLines.join('\r\n');
    this.processedFile = desiredText;
    this.processedFileName = desiredFileName;
    this.showDownloadButton = true;
    
    console.log("resultFile", this.processedFile);
    console.log("name", this.processedFileName);
  }

  createDesiredLine(originalLine: string) {
    const tokens = originalLine.split(this.separator);
    const desiredTokens = [];

    for (const field of this.selectedFields) {
      let index = field.value;
      let desiredToken = tokens[index];
      desiredTokens.push(desiredToken);
    }

    let desiredLine = desiredTokens.join(this.separator);
    return desiredLine;

  }

  downloadProcessedFile() {
    var blob = new Blob([this.processedFile], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, this.processedFileName);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = this.processedFileName;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
  }

  toggleOverlay() {
    this.processing = true;
  }
}

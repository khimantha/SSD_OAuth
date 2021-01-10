import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  authUrl = "";
  code = "";
  isLoggedIn = false;
  file = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log("Main");
    this.init();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
          console.log(params.code);

          if(this.code == "" || !this.code){
            this.getToken(params.code);
            this.code = params.code;
          }
        
          // this.token = params.code;
          this.isLoggedIn = true;
      }else{
        this.isLoggedIn =false;
      }
  });
    
  }

getToken(code){

  let reqObj = {
    code:code
  }

  this.http.post("http://localhost:3000/drive/getToken",reqObj).subscribe((tokenData:any) =>{  
    
  })

}

  init(){
    const params = [
      'response_type=code',
      'state=1234',
      'client_id=961383984487-nd3vhaa2qb1p99pstrsglh80opo51i7e.apps.googleusercontent.com',
      'scope=' +encodeURIComponent('https://www.googleapis.com/auth/drive'),
      "access_type = access_type=offline",
      "redirect_uri=" + encodeURIComponent('http://localhost:4200/upload'),
  ];
  this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.join('&');
  }


  uploadFile(){
    var formData = new FormData();
    formData.append("image", this.file);
  
    this.http.post("http://localhost:3000/drive/upload",formData).subscribe((data:any) =>{
      if(data.success){
        alert("Image Uploaded Sucessfully");
      }else{
        alert("Image Upload Failed");

      }
      
    })
  }



  handleFileInput(selectedFile){
    this.file = selectedFile.item(0);
  }

}

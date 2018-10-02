import { Component } from '@angular/core';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import "rxjs/add/operator/map";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'graphql-client3';
  src = ''

  constructor(private apollo: Apollo) { }

  uploadFile(file) {
    const query = gql`
      mutation uploadFile($file: Upload!) {
        uploadFile(file: $file) {
          link
        }
      }
    `;
    return this.apollo.mutate({
      mutation: query,
      variables: {
        file: file
      }
    })
  }

  hello() {
    const query = gql`
    {
      hi
    }
    `;
    return this.apollo.watchQuery({
      query: query,
      fetchPolicy: 'network-only'
    }).valueChanges
  }

  fileChange(event) {
    if (event.target.files) {
      this.uploadFile(event.target.files[0]).subscribe(
        result => {
          console.log(result)
          this.src = result.data.uploadFile.link;
        },
        error => console.log(error)
      )
    }
  }
}

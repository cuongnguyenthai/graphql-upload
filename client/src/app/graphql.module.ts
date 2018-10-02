import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from "@angular/common/http";
import { createUploadLink } from 'apollo-upload-client';

@NgModule({
  exports: [ApolloModule, HttpLinkModule, HttpClientModule]
})
export class GraphQLModule {
  constructor(apollo: Apollo) {
    apollo.create({
      link: createUploadLink({ uri: 'http://localhost:4000' }),
      cache: new InMemoryCache()
    }); 
  }
}

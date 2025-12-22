import type { StructureBuilder } from "sanity/structure"
import { HomeIcon, DocumentIcon, CaseIcon, UsersIcon, RocketIcon } from "@sanity/icons"

const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              // Home Page - Singleton
              S.listItem()
                .title("Home Page")
                .icon(HomeIcon)
                .child(S.document().schemaType("homePage").documentId("homePage")),

              // About Page - Singleton (if you want)
              S.listItem()
                .title("About Page")
                .icon(UsersIcon)
                .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            ]),
        ),

      S.divider(),

      S.listItem().title("Blog Posts").icon(DocumentIcon).child(S.documentTypeList("post").title("Blog Posts")),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !["homePage", "aboutPage", "blog", "product", "jobPosting"].includes(listItem.getId() ?? ""),
      ),
    ])

export default structure
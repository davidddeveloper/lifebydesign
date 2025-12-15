import { StructureBuilder } from "sanity/desk";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .schemaType("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),

      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== "homepage"
      ),
    ]);

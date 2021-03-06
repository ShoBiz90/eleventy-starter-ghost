const {titleCase} = require("title-case");

// This regex finds all wikilinks in a string
const wikilinkRegExp = /\[\[([\w\s/-]+)(.\w+)?\s?(\|\s?([\w\s/]+))?\]\]/g

function caselessCompare(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}

module.exports = {
    layout: "layouts/post2.njk",
    type: "note",
    eleventyComputed: {
        title: data => titleCase(data.title || data.page.fileSlug),
        backlinks: (data) => {
            const notes = data.collections.notes;
            const currentFileSlug = data.page.fileSlug;

            let backlinks = [];

            // Search the other notes for backlinks
            for(const otherNote of notes) {
                const noteContent = otherNote.template.frontMatter.content;

                // Get all links from otherNote
                const outboundLinks = (noteContent.match(wikilinkRegExp) || [])
                    .map(link => (
                        // Extract link location
                        link.slice(2,-2)
                            .split("|")[0]
                            .replace(/[^\w\s/-]+/g,'')
                            .replace(/.(md|markdown)\s?$/i, "")
                    ));

                // If the other note links here, return related info
                if(outboundLinks.some(link => caselessCompare(link, currentFileSlug))) {

                    

                    backlinks.push({
                        url: otherNote.url,
                        title: otherNote.data.title
                    })
                }
            }

            return backlinks;
        }
    }
}
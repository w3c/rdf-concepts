
# Common files for RDF specifications

This repository is meant to be used as a submodule in multiple repository holding RDF and SPARQL specifications.

## Retrieving group participants

The `participants.js` Node script can be used to retrieve the list of working group participants. It takes  an optional API Key (use empty string to omit).

    node participants.js <apikey> wg/rdf-star > participants.html

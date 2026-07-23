# Phase 17: User Feedback and Reranking

Results now include four lightweight feedback choices: Helpful, Not relevant,
Missing an ingredient, and Not a Filipino dish.

Feedback is stored in browser local storage for this phase. Helpful results are
promoted within the current result list, while negative feedback lowers their
display position. Selecting the same choice again removes it.

This phase does not yet aggregate feedback across users or modify the shared
Filipino catalog automatically. A later server-backed feedback phase should
review repeated signals before changing catalog rules or dish metadata.

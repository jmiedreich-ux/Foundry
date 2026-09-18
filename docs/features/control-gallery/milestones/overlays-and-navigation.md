# Overlay and navigation controls

## Outcome

Dialog, Drawer, Popover, Menu, Tabs, and Card provide their approved focus, dismissal, selection, and semantic behavior through the public library and gallery.

## Remaining work

Menu, Tabs, and Card browser checks remain. Menu browser checks are paused by owner. Before work resumes, the library quality foundation must select the internal interaction foundation and define the complete overlay/navigation API, positioning, focus, dismissal, and skin recipes. Existing observable behavior is evidence; the current hand-built internals are not presumed to be retained.

## Dependencies

The library quality foundation is complete and its representative complex-control proof is accepted.

## Completion evidence

Every control has real gallery behavior, focused browser coverage, and independent review. Modal controls contain and restore focus; non-modal controls preserve the documented dismissal and focus behavior.

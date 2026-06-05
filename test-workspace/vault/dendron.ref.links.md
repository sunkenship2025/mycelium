---
id: 73eb67ea-0291-45e7-8f2f-193fd6f00643
title: Links
desc: ""
updated: 1651563961085
created: 1608518909864
---

- This is a link to a [[not published note|bar]]

## Wiki Link

- [[mycelium.ref.figure]]
- [[same note link to anchor|#unpublished-page]]
- [[diff note link to anchor|mycelium.ref.figure#block]]

## Link in different vault without vault specified

Should get a quick pick prompt to choose a note to navigate to when clicking on following link in preview. Upon choosing the the note in quick Mycelium opens the note. If quick pick is cancelled NO errors should be shown.

- [[mycelium.ref.links.target-different-vault]]

## XVault Link

- vault1 bar: [[mycelium://vault/bar]]
- vault2 bar: [[mycelium://vault2/bar]]

## URL

[[https://wiki.mycelium.so/#getting-started]]

## XVault Note Ref

Vault1
![[mycelium://vault/bar]]

Vault2
![[mycelium://vault2/bar]]

## Unpublished page

- [[bar]]

---

## Note Refs

### Basic

`![[mycelium]]`

### Header

![[mycelium.welcome#header1]]

If the header is capitalized that also should work since they are case insensitive: ![[mycelium.welcome#Header1]]

### With Special Characters

![[mycelium.welcome#header-special-chars]]

---

## Block References

![[mycelium.ref.links.target#^123]]

## [[a header that's entirely a link|mycelium.apples]]

## Targeting a single list item without its children

## testing with ordered list

1. first ^nPm286FpKzGj
   1. first-a ^0NFOQ4Hi4frn
      1. first-a-1
1. second
   1. second-a ^AKRCeAVwwIX2

![[#^0NFOQ4Hi4frn:#^0NFOQ4Hi4frn]]

## note reference error messages

### no file

![[void]]
![[mycelium://vault/void]]

### wildcard no match

![[void.*]]

### ambiguous

![[bar]]

## Recursive refs

![[mycelium.ref.links.recursive-lvl-1]]

## Multiple refs in a row without list delineation

### Refs on each line

![[mycelium.ref.links.target-1]]
![[mycelium.ref.links.target-2]]
![[mycelium.ref.links.target-3]]

### Back to back refs

![[mycelium.ref.links.target-1]]![[mycelium.ref.links.target-2]] ![[mycelium.ref.links.target-3]]

## Link to a Website

- https://mycelium.so

## Link to PDF

- [Think](./assets/think.pdf)
- [with space](./assets/file%20with%20space.pdf)

## Confuses hashtag/usertags

[@myceliumhq](https://twitter.com/myceliumhq)

[#mycelium](https://twitter.com/hashtag/mycelium)

@user
#hash

## Broken Links

`mycelium doctor findBrokenLinks` and `mycelium doctor createMissingLinkedNotes` does not work if no vault prefix is specified

These can be fixed using `Mycelium: Convert Link` in various ways.

[[mycelium://vault/broken.link.with.vault.prefix]]
[[broken.link.without.vault.prefix]]
[[this is broken|broken.link]]
@broken.usertag
#broken.hashtag

## Inside a code block

The following link won't be highlighted since it's inside the code block, but Goto Note will still work.

```js
const x = 1;
// see more here:[[mycelium.ref.links.target-1]]
```

## Link to a non-note file

[[/vault/root.schema.yml]]

And a link to line 6 in that file: [[/vault/root.schema.yml#L6]]

And to an asset file: [[/assets/images/logo.png]]

## Link to a file outside any vault

To a file: [[other-files/config.ts]]

To a line in that file: [[other-files/config.ts#L6]]

To block anchors: [[other-files/config.ts#^getRaw]]
[[other-files/config.ts#^backup-file]]

## Link to a file containing images

We should be able to see these images in preview and when hovering over the link.

![[mycelium.ref.image]]

## Candidate links

This mycelium.ref.image will be a candidate link if the feature is enabled.

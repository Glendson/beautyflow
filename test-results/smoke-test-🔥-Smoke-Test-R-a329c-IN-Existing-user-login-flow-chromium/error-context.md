# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - heading "Sign in to BeautyFlow" [level=2] [ref=e4]
      - paragraph [ref=e5]:
        - text: Or
        - link "register your clinic" [ref=e6] [cursor=pointer]:
          - /url: /signup
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Email address
        - textbox [ref=e13]: test@beautyflow.test
      - generic [ref=e14]:
        - generic [ref=e15]: Password
        - textbox [ref=e17]: SecurePassword123!@
      - generic [ref=e18]: Invalid login credentials
      - button "Sign in" [ref=e20]
  - button "Open Next.js Dev Tools" [ref=e26] [cursor=pointer]:
    - img [ref=e27]
  - alert [ref=e30]
```
# Description and Overview

```
.
├── Cargo.toml
├── README.md
└── src
    ├── config.rs  # environment variables
    ├── const.rs   # constant variables
    ├── main.rs    # entry point
    ├── model.rs   # Database models
    ├── parser.rs  # Parser functions
    └── scraper.rs # Scraper functions
```

# Dependency

```
config <- main -> parser  <- const, models
             |                     |
             > -> scraper <- <- <- <
```

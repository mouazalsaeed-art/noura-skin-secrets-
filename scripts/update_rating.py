#!/usr/bin/env python3
"""Update the Bokadirekt rating + review count across the whole site.

Usage:  python3 scripts/update_rating.py 4.9 91

Touches the built pages (sv/en/ar), js/i18n.js, the schema.org data and
build.py, so a later rebuild keeps the same numbers.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [
    "build.py", "js/i18n.js",
    "index.html", "boka.html", "behandlingar.html", "integritet.html",
    "en/index.html", "en/boka.html", "en/behandlingar.html", "en/integritet.html",
    "ar/index.html", "ar/boka.html", "ar/behandlingar.html", "ar/integritet.html",
    "microneedling-uppsala.html", "hifu-uppsala.html", "hydrafacial-uppsala.html",
    "laser-uppsala.html", "peeling-uppsala.html",
]


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: update_rating.py <rating e.g. 4.9> <review count e.g. 91>")
    rating, count = sys.argv[1], sys.argv[2]
    if not re.fullmatch(r"[1-5]\.\d", rating) or not count.isdigit():
        sys.exit("rating must look like 4.9 and count must be a whole number")
    rating_sv = rating.replace(".", ",")

    rules = [
        # review counts in all three languages
        (r"\b\d+ (recensioner|reviews|تقييماً)", rf"{count} \1"),
        (r"(Based on |بناءً على )\d+", rf"\g<1>{count}"),
        # schema.org
        (r'"reviewCount": "\d+"', f'"reviewCount": "{count}"'),
        (r'"ratingValue": "[\d.]+"', f'"ratingValue": "{rating}"'),
        # visible rating numbers next to the stars
        (r"[1-5][.,]\d(?= ★)", None),             # "4.9 ★"
        (r"(?<=★ )[1-5]\.\d", rating),            # "★ 4.9" (Arabic)
        (r"[1-5],\d(?= av 5)", rating_sv),         # "4,9 av 5"
        (r"[1-5]\.\d(?= (out of 5|من 5))", rating),
        # only the Bokadirekt card (the Google card next to it has its own score)
        (r'(class="r-score num">)[1-5][.,]\d(?=</span></div>\s*<div><div class="r-stars">[^<]*</div><div class="r-meta">\d+ (recensioner|reviews|تقييماً))', None),
        (r'("rating_bokadirekt": \(")[1-5],\d', rf"\g<1>{rating_sv}"),
        (r'("rating_bokadirekt": \(")[1-5]\.\d', rf"\g<1>{rating}"),
        (r"((Rated |تقييم ))[1-5]\.\d", rf"\g<1>{rating}"),
    ]

    changed = 0
    for rel in FILES:
        p = ROOT / rel
        if not p.exists():
            continue
        s = p.read_text(encoding="utf-8")
        new = s
        for pat, repl in rules:
            if repl is None:  # keep the page's own decimal mark (4,9 in Swedish)
                new = re.sub(pat, lambda m: re.sub(
                    r"[1-5][.,]\d$",
                    rating_sv if "," in m.group(0)[-3:] else rating,
                    m.group(0)), new)
            else:
                new = re.sub(pat, repl, new)
        if new != s:
            p.write_text(new, encoding="utf-8")
            changed += 1
            print("updated", rel)
    print(f"done: {changed} files, rating {rating}, {count} reviews")


if __name__ == "__main__":
    main()

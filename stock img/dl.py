
"""Download specialty coffee images from Bing or Google.

Notes:
- "All images" is not realistically possible; use --max-num to control volume.
- Respect image licenses/usage rights for anything you publish.

Setup:
	python3 -m pip install --upgrade icrawler

Examples:
	python3 dl.py --engine bing   --keyword "specialty coffee" --max-num 200
	python3 dl.py --engine google --keyword "specialty coffee" --max-num 200
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path


def build_output_dir(base_dir: str, keyword: str, engine: str) -> Path:
	safe_keyword = "-".join(keyword.lower().split())
	return Path(base_dir) / engine / safe_keyword


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(description="Download specialty coffee images")
	parser.add_argument(
		"--engine",
		choices=["bing", "google"],
		default="bing",
		help="Search engine to crawl (default: bing)",
	)
	parser.add_argument(
		"--keyword",
		default="specialty coffee",
		help="Search keyword (default: specialty coffee)",
	)
	parser.add_argument(
		"--max-num",
		type=int,
		default=50,
		help="Max images to download (default: 50)",
	)
	parser.add_argument(
		"--output-dir",
		default="dataset",
		help="Base output directory (default: dataset)",
	)
	parser.add_argument(
		"--threads",
		type=int,
		default=8,
		help="Downloader thread count (default: 8)",
	)
	parser.add_argument(
		"--min-size",
		default="large",
		choices=["icon", "small", "medium", "large", "wallpaper"],
		help="Prefer image size (default: large)",
	)
	parser.add_argument(
		"--type",
		default="photo",
		choices=["photo", "clipart", "line", "animated"],
		help="Prefer image type (default: photo)",
	)
	return parser.parse_args()


def get_crawler(engine: str, storage_dir: str, threads: int):
	try:
		from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
	except ImportError as exc:
		raise SystemExit(
			"Missing dependency: icrawler. Install with: python3 -m pip install icrawler"
		) from exc

	if engine == "bing":
		return BingImageCrawler(
			downloader_threads=threads,
			storage={"root_dir": storage_dir},
		)

	return GoogleImageCrawler(
		downloader_threads=threads,
		storage={"root_dir": storage_dir},
	)


def main() -> None:
	args = parse_args()

	if args.max_num <= 0:
		raise SystemExit("--max-num must be > 0")

	out_dir = build_output_dir(args.output_dir, args.keyword, args.engine)
	out_dir.mkdir(parents=True, exist_ok=True)

	crawler = get_crawler(args.engine, str(out_dir), args.threads)

	# Filters supported by icrawler (best-effort; availability depends on engine).
	filters = {
		"type": args.type,
		"size": args.min_size,
	}

	# Some environments block Google images; Bing is usually more reliable.
	print(f"Engine: {args.engine}")
	print(f"Keyword: {args.keyword}")
	print(f"Output: {out_dir}")
	print(f"Max: {args.max_num}")

	crawler.crawl(
		keyword=args.keyword,
		filters=filters,
		max_num=args.max_num,
	)

	# Make it obvious where files landed.
	downloaded = len(list(out_dir.glob("*")))
	print(f"Downloaded files in {out_dir}: {downloaded}")


if __name__ == "__main__":
	# Ensure relative output goes next to this script when run from elsewhere.
	os.chdir(Path(__file__).resolve().parent)
	main()

import re
import sys

def generate_checklist(bib_file_path):
    """
    Parses a BibTeX file and generates a Markdown screening checklist.
    """
    try:
        with open(bib_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return "# Error: report.bib not found. Please export your Scopus results first."

    # Simple Regex to capture Author, Year, Title
    # Note: This is a basic parser. For production, use a library like bibtexparser.
    entries = re.findall(r'@\w+\{([^,]+),\s*author\s*=\s*\{([^}]+)\},\s*title\s*=\s*\{([^}]+)\},\s*.*?\s*year\s*=\s*\{(\d+)\}', content, re.DOTALL | re.IGNORECASE)

    output = ["# Week 3 Screening Checklist\n"]
    output.append("| Keep? | ID | Year | Author | Title | Reason (if Excluded) |")
    output.append("| :---: | :--- | :--- | :--- | :--- | :--- |")

    for entry in entries:
        citation_key = entry[0].strip()
        author = entry[1].strip().replace('\n', ' ')
        title = entry[2].strip().replace('\n', ' ')
        year = entry[3].strip()
        
        # Truncate long authors
        if " and " in author:
            author = author.split(" and ")[0] + " et al."
            
        output.append(f"| [ ] | `{citation_key}` | {year} | {author} | {title} | |")

    return "\n".join(output)

if __name__ == "__main__":
    # Default to report.bib in the current directory
    checklist = generate_checklist("report.bib")
    with open("screening_checklist.md", "w", encoding='utf-8') as f:
        f.write(checklist)
    print("Successfully generated 'screening_checklist.md' from 'report.bib'.")


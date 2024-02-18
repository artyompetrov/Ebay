import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from nbconvert import HTMLExporter

# read source notebook
with open('Prices.ipynb') as f:
    nb = nbformat.read(f, as_version=4)

# execute notebook
ep = ExecutePreprocessor(timeout=-1, kernel_name='python3')
ep.preprocess(nb)

# export to html
html_exporter = HTMLExporter()
html_exporter.exclude_input = True
html_data, resources = html_exporter.from_notebook_node(nb)

# write to output file
with open("output.html", "w+") as f:
    f.write(html_data)
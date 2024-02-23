import nbformat
from traitlets.config import Config
from nbconvert.preprocessors import ExecutePreprocessor
from nbconvert import HTMLExporter
c = Config()
c.TagRemovePreprocessor.remove_cell_tags = ("remove_cell",)
c.TagRemovePreprocessor.remove_all_outputs_tags = ("remove_output",)
c.TagRemovePreprocessor.remove_input_tags = ("remove_input",)
c.TagRemovePreprocessor.enabled = True
c.HTMLExporter.preprocessors = ["nbconvert.preprocessors.TagRemovePreprocessor"]

# read source notebook
with open('Prices.ipynb') as f:
    nb = nbformat.read(f, as_version=4)

# execute notebook
ep = ExecutePreprocessor(timeout=-1, kernel_name='python3')
ep.preprocess(nb)

# export to html
html_exporter = HTMLExporter(config=c)
html_exporter.exclude_input = True
html_data, resources = html_exporter.from_notebook_node(nb)

# write to output file
with open("output.html", "w+") as f:
    f.write(html_data)
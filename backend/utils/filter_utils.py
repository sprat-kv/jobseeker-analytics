import yaml


def parse_simple(
        term: str, 
        field: str,
        exclude: bool=False
        ) -> str:
    
    """
    Parses a simple combination of search field and search term into a gmail search string.
    If exclude is true, a "-" character is prepended to the field. 

    Args:
        term (str): list of terms to parse
        field (str): field to search
        exclude (bool): whether to exclude the terms
    """

    if exclude:
        out_str = f"-{field}: \"{term}\""
    else:
        out_str = f"{field}: \"{term}\""

    return out_str

def parse_wildcard(
        term: str, 
        field: str,
        exclude: bool=False
        ) -> str:
    """
    The wildcard * is convenient to use in a yaml file, but it is 
    not supported by the Gmail API. This function will parse 
    any number of wildcards as ({field}: "{term1}" AND {field}: "{term2}" AND ...)

    If exclude is true, a "-" character is prepended to the field. 

    Args:
        term (str): list of terms to parse
        field (str): field to search
        exclude (bool): whether to exclude the terms
    """
    if exclude:
        sub_terms = term.split(" * ")
        out_str =  "(" + " AND ".join([f"-{field}: \"{x}\"" for x in sub_terms]) + ")"

    else:
        sub_terms = term.split(" * ")
        out_str = "(" + " AND ".join([f"{field}: \"{x}\"" for x in sub_terms]) + ")"

    return out_str

def parse_filter_config(filter_path) -> str:
    with open(filter_path, 'r') as fid:
        data = yaml.safe_load(fid)

    filter_str_list = []
    for block in data:
        sub_filter_str_list = []
        for sub_list in block["field_list"]:
            field = sub_list["field"]
            include_terms = sub_list["include_terms"]
            exclude_terms = sub_list["exclude_terms"]
        
            simple_any_filters = []
            wildcard_any_filters = []
            if include_terms is not None:
                simple_any_filters += [parse_simple(x, field, exclude=False) for x in include_terms if not "*" in x]
                wildcard_any_filters += [parse_wildcard(x, field, exclude=False) for x in include_terms if "*" in x]
            if exclude_terms is not None:
                simple_any_filters +=  [parse_simple(x, field, exclude=True) for x in include_terms if not "*" in x]
                wildcard_any_filters += [parse_wildcard(x, field, exclude=True) for x in exclude_terms if "*" in x]

            if (simple_any_filters + wildcard_any_filters):
                sub_filter_str_list.append(" OR ".join(simple_any_filters + wildcard_any_filters))


        if sub_filter_str_list:
            if block["logic"] == "any":
                filter_str_list.append(" OR ".join(sub_filter_str_list))
            elif block["logic"] == "all":
                filter_str_list.append(" AND ".join([f"({x})" for x in sub_filter_str_list]))

    filter_str = "(" + " OR ".join([f"({x})" for x in filter_str_list]) + ")"
    return filter_str


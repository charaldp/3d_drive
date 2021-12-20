@extends('layouts.app')
<rim-editor
    :rim="'{{json_encode($rim)}}'"
    :dimension_names="'{{json_encode($rim->dimension_names())}}'"
>
</rim-editor>

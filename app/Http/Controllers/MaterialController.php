<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Parts\Rim;
use App\Models\Fabrication\Material;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $id = Auth::user()->id;
        $materials = Material::where('user_id', $id)->get()->toArray();
        // dd($materials);
        return $materials;
    }

    public function create() {
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd(Auth::user() ,$request->user());

        $validatedData = $request->validate([
            'type_dimensions' => 'required',
            'rim_type' => 'required',
        ]);
        $validatedData['user_id'] = Auth::user()->id;
        // dd($validatedData);
        $rim = Rim::create($validatedData);
        return $rim;

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

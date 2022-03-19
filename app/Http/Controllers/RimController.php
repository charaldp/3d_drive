<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Parts\Rim;

class RimController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    public function create() {
        $rim = new Rim(Rim::$creation_attributes);
        $rim->id = 0;
        return view('models.rim.index')->with(['rim' => $rim]);
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
            'name' => 'required',
            'material_id' => 'required',
            'type_dimensions' => 'required',
            'rim_type' => 'required',
        ]);
        // dd($validatedData);
        $validatedData['user_id'] = Auth::user()->id;
        // dd($validatedData);
        $rim = Rim::create($validatedData);
        return $rim;

    }

    public function edit($id)
    {
        return view('models.rim.index')->with(['rim' => Rim::find($id)]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return view('models.rim.index')->with(['rim' => Rim::find($id)]);
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
        $validatedData = $request->validate([
            'name' => 'required',
            'material_id' => 'required',
            'type_dimensions' => 'required',
            'rim_type' => 'required',
        ]);
        $rim = Rim::find($id);
        $rim->fill($validatedData);
        $rim->update();
        return $rim;
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

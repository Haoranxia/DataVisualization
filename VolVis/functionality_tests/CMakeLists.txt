add_executable(FunctionalityTests
	"src/main.cpp"
	"src/tests.cpp")
target_link_libraries(FunctionalityTests PRIVATE VolVis Catch2::Catch2)
target_compile_features(FunctionalityTests PRIVATE cxx_std_17)
set_project_warnings(FunctionalityTests)

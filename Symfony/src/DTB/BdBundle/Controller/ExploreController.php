<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Form\BandeDessineeType;
use DTB\BdBundle\Entity\Planche;

class ExploreController extends Controller
{
    public function indexAction()
    {
        $bandeDessinees = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee')->findBy(array(), array("id" => "asc"));
        $categories = $this->getDoctrine()->getRepository('DTBBdBundle:Categorie')->findBy(array(), array("name" => "asc"));
        
        return $this->render('DTBBdBundle:Explore:index.html.twig', 
                array('bds' => $bandeDessinees,
                    'categories' => $categories));
    }
}
